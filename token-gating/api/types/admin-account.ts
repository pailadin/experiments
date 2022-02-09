import { AccountNext, AccountRole } from './account';

export type AdminAccount = AccountNext & {
  emailAddress: string;
  role: AccountRole.ADMIN;
};
