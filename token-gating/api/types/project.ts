import { Node } from './node';

export type Project = Node & {
  name: string;
  description: string;
  contractAddress: string;
  discordId: string;
  discordChannel: string;
  discordBotAccessToken: string;
  createdAt: Date;
  updatedAt: Date;
};
