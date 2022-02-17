/* eslint-disable camelcase */
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
