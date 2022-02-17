import { ID, Node } from './node';

export type Project = Node & {
  name: string;
  description: string;
  contractAddress: string;
  discordGuild: string;
  discordChannel: string;
  discordRoleId: string;
  adminAccount: ID;
  createdAt: Date;
  updatedAt: Date;
};
