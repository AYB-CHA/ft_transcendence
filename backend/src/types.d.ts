import { Request } from 'express';

export type HelloTranscendence = 'Hello Transcendence!';

export type RequestType = Request & { userPayload: { sub: string } };

export type RegisterUserType = {
  username: string;
  email: string;
  fullName: string;
  password?: string;
  authProvider?: 'FT' | 'GITHUB';
};

export type LoginUserType = {
  usernameOrEmail: string;
  password: string;
};
