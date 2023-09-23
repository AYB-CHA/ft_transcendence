import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export default class LoginDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  usernameOrEmail: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
