import { ID, Node } from './node';

export type Project = Node & {
  name: string;
  description: string;
  contractAddress: string;
  discordGuild: string;
  discordChannel: string;
  discordAccessToken: string;
  adminAccount: ID;
  createdAt: Date;
  updatedAt: Date;
};
