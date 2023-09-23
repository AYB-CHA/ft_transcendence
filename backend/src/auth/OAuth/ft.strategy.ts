import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RegisterUserType } from 'src/types';

@Injectable()
export class FtStrategy {
  redirectUrl = 'http://localhost:4000/auth/back?provider=ft';
  constructor(readonly configService: ConfigService) {}
  getRedirectUrl() {
    let url = new URL('https://api.intra.42.fr/oauth/authorize');
    url.searchParams.append(
      'client_id',
      this.configService.get('FT_PUBLIC_KEY'),
    );
    url.searchParams.append('redirect_uri', this.redirectUrl);
    url.searchParams.append('response_type', 'code');
    return url.toString();
  }

  async getUserData(code: string): Promise<RegisterUserType> {
    const accessToken = await this.getAccessToken(code);
    try {
      let response = await fetch('https://api.intra.42.fr/v2/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      let data = await response.json();
      return {
        email: data.email,
        fullName: data.usual_full_name,
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
      form.append('grant_type', 'authorization_code');
      form.append('client_id', this.configService.get('FT_PUBLIC_KEY'));
      form.append('client_secret', this.configService.get('FT_SECRET_TOKEN'));
      form.append('code', code);
      form.append('redirect_uri', this.redirectUrl);

      let response = await fetch('https://api.intra.42.fr/oauth/token', {
        body: form,
        method: 'POST',
      });

      let data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error(error);
    }
    throw new InternalServerErrorException();
  }
}
