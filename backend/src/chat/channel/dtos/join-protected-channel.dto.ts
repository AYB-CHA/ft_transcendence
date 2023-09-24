import { IsNotEmpty } from 'class-validator';

export default class JoinProtectedChannelDto {
  @IsNotEmpty()
  password: string;
}
