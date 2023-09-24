import { IsNotEmpty, MaxLength } from 'class-validator';

export default class NewChannelDto {
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsNotEmpty()
  @MaxLength(50)
  avatar: string;
}
