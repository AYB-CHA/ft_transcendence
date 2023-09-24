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

export type UpdateUserType = {
  username: string;
  email: string;
  fullName: string;
  avatar: string;
};

export type UpdateUserPasswordType = {
  oldPassword: string;
  newPassword: string;
};

export type LoginUserType = {
  usernameOrEmail: string;
  password: string;
};
