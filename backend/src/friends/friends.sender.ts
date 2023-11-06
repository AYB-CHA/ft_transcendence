import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

export type TargetUsers = string[];

@Injectable()
export class FriendsUpdateSender {
  private notifer = new Subject<TargetUsers>();

  listen(callback: (users: TargetUsers) => void) {
    this.notifer.subscribe({ next: callback });
  }

  notify(target: TargetUsers) {
    this.notifer.next(target);
  }
}
