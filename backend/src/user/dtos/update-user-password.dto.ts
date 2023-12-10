import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export default class UpdateUserPasswordDto {
  @IsNotEmpty()
  @IsString()
  oldPassword: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  newPassword: string;
}
