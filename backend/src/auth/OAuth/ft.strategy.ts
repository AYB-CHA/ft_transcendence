import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RegisterUserType } from 'src/types';

@Injectable()
export class FtStrategy {
  private readonly redirectUrl: string;

  constructor(private readonly configService: ConfigService) {
    const url = new URL(this.configService.get('BACKEND_BASEURL'));
    url.pathname += 'auth/back';
    url.searchParams.append('provider', 'ft');
    this.redirectUrl = url.toString();
  }

  getRedirectUrl() {
    const url = new URL('https://api.intra.42.fr/oauth/authorize');
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
      const response = await fetch('https://api.intra.42.fr/v2/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) throw new BadRequestException();
      const data = await response.json();

      return {
        // providerId: data.id,
        avatar: '',
        email: data.email,
        fullName: data.usual_full_name,
        username: data.login,
      };
    } catch {}
    throw new InternalServerErrorException();
  }

  private async getAccessToken(code: string) {
    try {
      const form = new FormData();
      form.append('grant_type', 'authorization_code');
      form.append('client_id', this.configService.get('FT_PUBLIC_KEY'));
      form.append('client_secret', this.configService.get('FT_SECRET_TOKEN'));
      form.append('code', code);
      form.append('redirect_uri', this.redirectUrl);

      const response = await fetch('https://api.intra.42.fr/oauth/token', {
        body: form,
        method: 'POST',
      });

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error(error);
    }
    throw new InternalServerErrorException();
  }
}
