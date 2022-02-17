/* eslint-disable no-console */

import R from 'ramda';
import AsyncGroup from '@highoutput/async-group';
import axios from 'axios';
import ObjectId, { ObjectType } from '../../../../library/object-id';
import { Context } from '../../types';
import logger from '../../../../library/logger';
import { DiscordRole } from '../../../../types/discord-role';

export default {
  Mutation: {
    async createProject(_: never, args: {
      request: {
        name: string;
        description: string;
        contractAddress: string;
        discordGuild:string;
        discordChannel: string;
        discordAccessToken: string;
      }
    }, ctx: Context) {
      const {
        name, description, contractAddress, discordGuild, discordChannel, discordAccessToken,
      } = args.request;

      let collection = await ctx.services.worker.collectionController.findOneCollection({
        filter: {
          contractAddress,
        },
      });

      if (!collection) {
        collection = await ctx.services.worker.collectionController.createCollection({
          id: ObjectId.generate(ObjectType.COLLECTION).buffer,
          data: {
            contractAddress,
          },
        });

        AsyncGroup.add(ctx.services.worker.syncCollection({
          collection: collection.id,
          priority: true,
        }));
      }

      const projectExists = await ctx.services.project.projectController.findOneProject({
        filter: {
          contractAddress,
        },
      });

      if (projectExists) {
        logger.warn('Contract Address exists on other projects');
        return {
          data: null,
          error: {
            __typename: 'ContractAddressExistsError',
            message: 'Contract Address exists on other projects',
          },
        };
      }

      const discordRoleResponse = await axios.post(`https://discord.com/api/guilds/${discordGuild}/roles`, {
        name: 'VIP',
      }, {
        headers: {
          Authorization: `Bot ${ctx.config.BOT_TOKEN}`,
        },
      });

      const discordRole: DiscordRole = discordRoleResponse.data;

      if (!discordRole.id) {
        return {
          data: null,
          error: {
            __typename: 'InvalidDiscordAccessTokenError',
            message: 'Invalid Discord Access Token',
          },
        };
      }

      await axios.put(`https://discord.com/api/v9/channels/${discordChannel}/permissions/${discordGuild}`, {
        id: discordRole.id, type: 0, allow: '1024', deny: '0',
      }, {
        headers: {
          Authorization: `Bot ${ctx.config.BOT_TOKEN}`,
        },
      });

      await axios.put(`https://discord.com/api/v9/channels/${discordChannel}/permissions/${discordGuild}`, {
        id: discordGuild, type: 0, allow: '0', deny: '1024',
      }, {
        headers: {
          Authorization: `Bot ${ctx.config.BOT_TOKEN}`,
        },
      });

      const project = await ctx.services.project.projectController.createProject({
        id: ObjectId.generate(ObjectType.PROJECT).buffer,
        data: {
          name,
          description,
          contractAddress,
          discordGuild,
          discordChannel,
          discordAccessToken,
          discordRoleId: discordRole.id,
          adminAccount: ctx.state.user.id,
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
          adminAccount: ctx.state.user.id,
        },
      });

      return true;
    },
  },
};
