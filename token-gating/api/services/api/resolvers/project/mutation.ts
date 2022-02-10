/* eslint-disable no-console */
import { Client, Intents } from 'discord.js';
import R from 'ramda';
import ObjectId, { ObjectType } from '../../../../library/object-id';
import { Context } from '../../types';

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

      const client = new Client({
        intents: [Intents.FLAGS.GUILDS],
      });

      await client.login(discordBotAccessToken);

      if (!client.user) {
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
