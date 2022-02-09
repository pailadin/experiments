import { Transaction } from './transaction';

export type EtherScanObject = {
  status: string,
  message:string,
  result: Transaction[]
};
