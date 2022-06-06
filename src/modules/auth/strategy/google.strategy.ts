import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientId: '',
      clientSecret: '',
      callbackUrl: '',
      scope: '',
    });
  }

  async validate(accessToken: string, profile: any, done: VerifyCallback) {
    done(null, profile);
  }
}
