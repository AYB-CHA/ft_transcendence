import {
  IsAlphanumeric,
  IsEmail,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export default class RegisterDto {
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  @IsAlphanumeric()
  username: string;

  @IsString()
  @MinLength(5)
  @MaxLength(20)
  fullName: string;

  @IsString()
  @IsEmail()
  @MinLength(5)
  @MaxLength(100)
  email: string;

  @IsString()
  @IsStrongPassword()
  password: string;
}
