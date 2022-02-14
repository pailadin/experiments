import { ID } from './node';

export type Ownership = {
  id: ID;
  collectionID: ID;
  tokenID: string;
  owner: string;
  timestamp: number;
  createdAt: Date;
};
