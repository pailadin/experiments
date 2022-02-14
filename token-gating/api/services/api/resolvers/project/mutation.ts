/* eslint-disable no-console */

import R from 'ramda';
import axios from 'axios';
import ObjectId, { ObjectType } from '../../../../library/object-id';
import { Context } from '../../types';
import { DiscordResponse } from '../../../../types/discord-response';

export default {
  Mutation: {
    async createProject(_: never, args: {
      request: {
        name: string;
        description: string;
        contractAddress: string;
        discordId:string;
        discordChannel: string;
        discordBotAccessToken: string;
      }
    }, ctx: Context) {
      const {
        name, description, contractAddress, discordId, discordChannel, discordBotAccessToken,
      } = args.request;

      const response = await axios.get('https://discord.com/api/users/@me', {
        headers: {
          Authorization: `Bearer ${discordBotAccessToken}`,
        },
      });

      const userInfo:DiscordResponse = response.data;

      if (!userInfo.email) {
        console.log('discord token error');
        return {
          data: null,
          error: {
            __typename: 'InvalidDiscordBotAccessTokenError',
            message: 'Invalid Discord Bot Access Token',
          },
        };
      }

      const project = await ctx.services.project.projectController.createProject({
        id: ObjectId.generate(ObjectType.PROJECT).buffer,
        data: {
          name,
          description,
          contractAddress,
          discordId,
          discordChannel,
        },
      });

      return {
        data: {
          project: {
            ...R.omit(['id'], project),
            id: new ObjectId(project.id).toString(),
          },
        },
        error: null,
      };
    },

    async deleteProject(_: never, args: {
      request: {
       id: string;
      }
    }, ctx: Context) {
      const id = ObjectId.from(args.request.id).buffer;

      await ctx.services.project.projectController.deleteProject({
        filter: {
          id,
        },
      });

      return true;
    },
  },
};
