import { Request } from 'express';

export type HelloTranscendence = 'Hello Transcendence!';

export type RequestType = Request & { user: { id: string } };

export type RegisterUserType = {
//  providerId?: number;
  username: string;
  email: string;
  fullName: string;
  // password?: string;
  // authProvider?: 'FT' | 'GITHUB';
  avatar: string;
};

export type UpdateUserType = {
  username: string;
  email: string;
  fullName: string;
  avatar: string;
  password?: string;
  passwordConfirmation?: string;
};

export type UpdateUserPasswordType = {
  oldPassword: string;
  newPassword: string;
};

export type LoginUserType = {
  usernameOrEmail: string;
  password: string;
};
