import { Subject, Subscription } from 'rxjs';
import { Injectable } from '@nestjs/common';

export type Notification = {};

@Injectable()
export class NotificationSender {
  private notifier = new Subject<Notification>();

  notify(value: Notification) {
    this.notifier.next(value);
  }

  listen(callback: (value: Notification) => void): Subscription {
    return this.notifier.subscribe({ next: callback });
  }
}
