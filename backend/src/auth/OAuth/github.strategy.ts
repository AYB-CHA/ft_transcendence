import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RegisterUserType } from 'src/types';

@Injectable()
export class GithubStrategy {
  baseUrl = '';
  constructor(private readonly configService: ConfigService) {}
  getRedirectUrl() {
    let url = new URL('https://github.com/login/oauth/authorize');
    url.searchParams.append(
      'client_id',
      this.configService.get('GITHUB_PUBLIC_KEY'),
    );
    url.searchParams.append('scope', 'user:email');
    return url.toString();
  }

  async getUserData(code: string): Promise<RegisterUserType> {
    const accessToken = await this.getAccessToken(code);
    console.log(accessToken);
    try {
      let response = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      let emailsResponse = await fetch('https://api.github.com/user/emails', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      let data = await response.json();
      let eMails = await emailsResponse.json();

      return {
        email: eMails[0].email,
        fullName: data.name,
        username: data.login,
      };
    } catch (error) {
      console.log(error);
    }
    throw new InternalServerErrorException();
  }

  private async getAccessToken(code: string) {
    try {
      let form = new FormData();
      form.append('client_id', this.configService.get('GITHUB_PUBLIC_KEY'));
      form.append('client_secret', this.configService.get('GITHUB_SECRET_KEY'));
      form.append('accept', 'json');
      form.append('code', code);

      let response = await fetch(
        'https://github.com/login/oauth/access_token',
        {
          body: form,
          method: 'POST',
          headers: { Accept: 'application/json' },
        },
      );
      let data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error(error);
    }
    throw new InternalServerErrorException();
  }
}
