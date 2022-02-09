import { ID } from './node';

export type Event = {
  sender: string;
  receiver: string;
  tokenID: string;
  collection: ID;
  blockNumber: string;
  timestamp: number;
};
