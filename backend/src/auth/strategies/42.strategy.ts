import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor(
    private readonly authservive: AuthService,
    protected readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get('FT_PUBLIC_KEY'),
      clientSecret: configService.get('FT_SECRET_TOKEN'),
      callbackURL: configService.get('CALLBACK_URL'),
      profileFields: {
        id: function (obj) {
          return String(obj.id);
        },
        login: 'login',
        displayName: 'displayname',
        last_name: 'last_name',
        first_name: 'first_name',
        profileUrl: 'url',
        email: 'email',
        phone: 'phone',
        image_url: 'image.link',
      },
    });
  }

  async validate(accessToken, refreshToken, profile, cb) {
    const user = await this.authservive._42Validation(profile);
    if (!user) {
      throw new Error('No profile from 42');
    }
    if (!accessToken) {
      throw new Error('No access token from 42');
    }
    return cb(null, user);
  }
}
