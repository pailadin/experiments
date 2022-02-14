import { Node } from './node';

export enum AccountRole {
  ADMIN = 'ADMIN',
  HOLDER = 'HOLDER',
}

export type AccountNext = Node & {
  role: AccountRole;
  createdAt: Date;
  updatedAt: Date;
};
