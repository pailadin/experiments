/* eslint-disable camelcase */

export enum DiscordRoleAction {
  ALLOW = 'ALLOW',
  DENY = 'DENY',
}

export type DiscordRole = {
  id: string;
  name: string;
  permissions: number;
  position: number;
  color: number;
  hoist: boolean;
  managed: boolean;
  mentionable: boolean;
  icon: unknown | null;
  unicode_emoji: unknown | null;
};
