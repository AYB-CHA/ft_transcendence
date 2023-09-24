export enum ChannelType {
  USER = 'private',
  ADMIN = 'public',
  BLOGGER = 'protected',
}

export type newChannelType = {
  name: string;
  avatar: string;
  type: ChannelType;
  password: string | null;
};
