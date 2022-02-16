/* eslint-disable no-console */
import axios from 'axios';

import { Context } from '../../types';
import logger from '../../../../library/logger';

export default {
  Mutation: {
    async getDiscordGuildInfo(_: never, args: {
      request: {
        guildId: string;
      }
    }, ctx: Context) {
      const { guildId } = args.request;

      const channelsResponse = await axios.post(`https://discord.com/api/guilds/${guildId}/channels`, {}, {
        headers: {
          Authorization: `Bearer ${ctx.config.BOT_TOKEN}`,
        },
      });

      logger.info(channelsResponse.data);

      if (!channelsResponse.data) {
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
            channels: {
              ...channelsResponse.data,
            },
          },
        },

      };
    },
  },
};
