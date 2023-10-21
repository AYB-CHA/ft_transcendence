import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RequestType } from 'src/types';
import { DirectMessageService } from './direct-message.service';

@Controller('/chat/dm')
export class DirectMessageController {
  constructor(private readonly dmService: DirectMessageService) {}
  @Post('/thread')
  @UseGuards(AuthGuard)
  getThreadId(
    @Request() req: RequestType,
    @Body('userId') userId: string | null,
  ) {
    if (!userId) throw new BadRequestException();
    const initiatorId = req.userPayload.sub;
    return this.dmService.getThreadID(initiatorId, userId);
  }

  @Get('/messages/:id')
  @UseGuards(AuthGuard)
  getOldMessages(@Request() req: RequestType, @Param('id') id: string) {
    return this.dmService.getOldMessages(req.userPayload.sub, id);
  }
  @Get('/threads')
  @UseGuards(AuthGuard)
  getUserThreads(@Request() req: RequestType) {
    return this.dmService.getUserThreads(req.userPayload.sub);
  }

  @Get('/thread/other/:id')
  @UseGuards(AuthGuard)
  getThreadOtherUser(@Request() req: RequestType, @Param('id') id: string) {
    return this.dmService.getThreadOtherUser(req.userPayload.sub, id);
  }
}
