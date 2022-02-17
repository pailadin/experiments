/* eslint-disable no-console */
import axios from 'axios';
import { Context } from '../../types';
import { DiscordChannel } from '../../../../types/discord-channel';

export default {
  Query: {
    async getDiscordChannels(_: never, args: {
      guildId: string;
    }, ctx: Context) {
      const { guildId } = args;

      const channelsResponse = await axios.get(`https://discord.com/api/guilds/${guildId}/channels`, {
        headers: {
          Authorization: `Bot ${ctx.config.BOT_TOKEN}`,
        },
      });

      const channels: DiscordChannel[] = channelsResponse.data || [];

      return {

        data: {
          channels,
        },

      };
    },
  },
};
