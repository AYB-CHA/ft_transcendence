import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Matches,
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
  @Matches(/^[a-zA-Z0-9-_]+$/, {
    message:
      'The username can only contain alphanumeric characters, dashes or underscores',
  })
  username: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail(undefined, { message: 'the email must be a valid email address' })
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
  @IsOptional()
  passwordConfirmation?: string;
}
