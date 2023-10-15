import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RegisterUserType } from 'src/types';

@Injectable()
export class GithubStrategy {
  constructor(private readonly configService: ConfigService) {}
  getRedirectUrl() {
    const url = new URL('https://github.com/login/oauth/authorize');
    url.searchParams.append(
      'client_id',
      this.configService.get('GITHUB_PUBLIC_KEY'),
    );
    url.searchParams.append('scope', 'user:email');
    return url.toString();
  }

  async getUserData(code: string): Promise<RegisterUserType> {
    const accessToken = await this.getAccessToken(code);
    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) throw new Error();
      const emailsResponse = await fetch('https://api.github.com/user/emails', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!emailsResponse.ok) throw new Error();
      const data = await response.json();
      const eMails = await emailsResponse.json();

      return {
        email: eMails[0].email,
        fullName: data.name,
        username: data.login,
      };
    } catch (error) {
      console.error(error);
    }
    throw new InternalServerErrorException();
  }

  private async getAccessToken(code: string) {
    try {
      const form = new FormData();
      form.append('client_id', this.configService.get('GITHUB_PUBLIC_KEY'));
      form.append('client_secret', this.configService.get('GITHUB_SECRET_KEY'));
      form.append('accept', 'json');
      form.append('code', code);

      const response = await fetch(
        'https://github.com/login/oauth/access_token',
        {
          body: form,
          method: 'POST',
          headers: { Accept: 'application/json' },
        },
      );
      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error(error);
    }
    throw new InternalServerErrorException();
  }
}
