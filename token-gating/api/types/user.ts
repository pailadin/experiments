import { Node } from './node';

export type User = Node & {
  email: string;
  createdAt: Date;
};
