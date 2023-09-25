import { ChannelUserRole } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';

export default class UpgradeUserDto {
  @IsEnum(ChannelUserRole)
  grade: ChannelUserRole;

  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
