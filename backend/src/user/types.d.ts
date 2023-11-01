export type UserSearchEntity = {
  id: string;
  username: string;
  requestId: string | null;
  fullName: string;
  avatar: string;
  status: FriendshipStatus;
};

export type FriendshipStatus =
  | 'FRIEND'
  | 'PENDING-SENDER'
  | 'PENDING-RECEIVER'
  | 'NONE';
