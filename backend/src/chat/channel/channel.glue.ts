import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

export type ChannelGlueEventsType =
  | 'NEW_CHANNEL_MEMBER'
  | 'CHANNEL_MEMBER_LEFT';

type SubjectType = {
  name: ChannelGlueEventsType;
  channelId?: string;
};

@Injectable()
export class ChannelGlue {
  private readonly subject = new Subject<SubjectType>();
  listen(handler: (value: SubjectType) => void) {
    this.subject.subscribe(handler);
  }
  emit(data: SubjectType) {
    this.subject.next(data);
  }
}
