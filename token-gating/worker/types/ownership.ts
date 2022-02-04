import { ID, Node } from './node';

export type Ownership = Node & {
  collection: ID;
  tokenID: string;
  owner: string;
  createdAt: Date;
};
