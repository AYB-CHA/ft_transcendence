import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export default class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(20)
  fullName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(20)
  @IsAlphanumeric()
  username: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @MinLength(5)
  @MaxLength(100)
  email: string;

  @IsString()
  @IsNotEmpty()
  avatar: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  @IsOptional()
  password?: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  @IsOptional()
  passwordConfirmation?: string;
}
