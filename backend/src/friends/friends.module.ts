import { FriendsController } from './friends.controller';
import { FriendsGateway } from './friends.gateway';
import { FriendsUpdateSender } from './friends.sender';
import { FriendsService } from './friends.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [FriendsController],
  providers: [FriendsService, FriendsGateway, FriendsUpdateSender],
})
export class FriendsModule {}
