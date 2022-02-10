/* eslint-disable no-console */
import { Client, Intents } from 'discord.js';
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

      console.log('nice');

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

      console.log('discord token succeeded');

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
          ...project,
          id: new ObjectId(project.id).toString(),
        },
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
