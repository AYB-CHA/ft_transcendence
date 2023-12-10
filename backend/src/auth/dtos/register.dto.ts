import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Matches,
  MaxLength,
} from 'class-validator';

export default class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  fullName: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9-_]+$/, {
    message:
      'The username can only contain alphanumeric characters, dashes or underscores',
  })
  username: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail(undefined, { message: 'the email must be a valid email address' })
  @MaxLength(100)
  email: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  password: string;
}
