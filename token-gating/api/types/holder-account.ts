import { AccountNext, AccountRole } from './account';

export type HolderAccount = AccountNext & {
  ethereumAddress: string;
  discordId: string;
  role: AccountRole.HOLDER;
  channelJoined:boolean;
};
