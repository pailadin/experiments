import { ID, Node } from './node';

export type Ownership = Node & {
  collection: ID;
  tokenID: string;
  owner: string;
  blockNumber: string;
  createdAt: Date;
};
