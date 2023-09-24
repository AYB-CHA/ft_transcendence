import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';

enum ChannelType {
  USER = 'private',
  ADMIN = 'public',
  BLOGGER = 'protected',
}

export default class NewChannelDto {
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsNotEmpty()
  @MaxLength(50)
  avatar: string;

  @IsNotEmpty()
  @IsEnum(ChannelType)
  type: ChannelType;

  @IsOptional()
  @IsNotEmpty()
  @MaxLength(50)
  @MinLength(5)
  password: string;
}
