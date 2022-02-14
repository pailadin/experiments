import { AccountNext, AccountRole } from './account';

export type HolderAccount = AccountNext & {
  ethereumAddress: string;
  discordAccessToken: string;
  role: AccountRole.HOLDER;
};
