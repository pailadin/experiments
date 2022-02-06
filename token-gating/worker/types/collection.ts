import { ID } from './node';

export enum CollectionStatus {
  INITIALIZING = 'INITIALIZING',
  UPDATED = 'UPDATED',
}

export type Collection = {
  id: ID;
  contractAddress: string;
  status: CollectionStatus;
  blockNumber: string;
  createdAt: Date;
};
