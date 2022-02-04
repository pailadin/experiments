import { Node } from './node';

export enum CollectionStatus {
  INITIALIZING = 'INITIALIZING',
  UPDATED = 'UPDATED',
}

export type Collection = Node & {
  contractAddress: string;
  status: CollectionStatus;
  createdAt: Date;
};
