/* eslint-disable no-console */
import axios from 'axios';
import { Context } from '../../types';
import { DiscordChannel } from '../../../../types/discord-channel';

export default {
  Mutation: {
    async getDiscordGuildInfo(_: never, args: {
      request: {
        guildId: string;
      }
    }, ctx: Context) {
      const { guildId } = args.request;

      const channelsResponse = await axios.get(`https://discord.com/api/guilds/${guildId}/channels`, {
        headers: {
          Authorization: `Bot ${ctx.config.BOT_TOKEN}`,
        },
      });

      const channels: DiscordChannel[] = channelsResponse.data;

      if (channels.length === 0) {
        return {
          error: {
            __typename: 'InvalidDiscordAccessTokenError',
            message: 'Invalid Discord Access Token',
          },
        };
      }

      return {

        data: {
          guild: {
            id: guildId,
            channels,
          },
        },

      };
    },
  },
};
