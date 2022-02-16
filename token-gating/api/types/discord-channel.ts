/* eslint-disable camelcase */
export type DiscordChannel = {
  id: string;
  type: number;
  name: string;
  position: number;
  parent_id: string;
  guild_id: string;
  permission_overwrites: unknown[];
  nsfw: boolean;
};
