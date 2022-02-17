/* eslint-disable no-console */
import { Context } from '../../types';

export default {
  Query: {
    async getDiscordChannels(_: never, args: {
      guildId: string;
    }, ctx: Context) {
      const { guildId } = args;

      const channels = await ctx.services.discord.getGuildChannels({
        guildId,
      });

      return {

        data: {
          channels,
        },

      };
    },
  },
};
