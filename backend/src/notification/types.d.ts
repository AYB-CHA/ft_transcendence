export type NotificationType =
  | 'CHANNEL_INVITATION'
  | 'FRIEND_INVITAION'
  | 'GAME_INVITAION';

export type Notification = {
  senderId: string;
  receiverId: string;
  channelId?: string;
  type: NotificationType;
  link: string;
};
