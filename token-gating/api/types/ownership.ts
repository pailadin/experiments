import { ID, Node } from './node';

export type Ownership = Node & {
  collectionID: ID;
  tokenID: string;
  owner: string;
  timestamp: number;
  createdAt: Date;
};
