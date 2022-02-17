/* eslint-disable no-console */

import R from 'ramda';
import AsyncGroup from '@highoutput/async-group';
import ObjectId, { ObjectType } from '../../../../library/object-id';
import { Context } from '../../types';
import logger from '../../../../library/logger';
import { DiscordRole, DiscordRoleAction } from '../../../../types/discord-role';

export default {
  Mutation: {
    async createProject(_: never, args: {
      request: {
        name: string;
        description: string;
        contractAddress: string;
        discordGuild:string;
        discordChannel: string;
      }
    }, ctx: Context) {
      const {
        name, description, contractAddress, discordGuild, discordChannel,
      } = args.request;

      const discordRoles = await ctx.services.discord.getGuildRoles({
        guildId: discordGuild,
      });

      let discordRole : DiscordRole | null | undefined = discordRoles.find((x) => x.name === 'VIP');

      if (!discordRole) {
        discordRole = await ctx.services.discord.addGuildRole({
          roleName: 'VIP',
          guildId: discordGuild,
        });

        if (!discordRole) {
          return {
            data: null,
            error: {
              __typename: 'InvalidDiscordAccessTokenError',
              message: 'Invalid Discord Access Token',
            },
          };
        }
      }

      await ctx.services.discord.addRoleToChannelPermission({
        roleId: discordGuild,
        channelId: discordChannel,
        roleAction: DiscordRoleAction.DENY,
      });

      await ctx.services.discord.addRoleToChannelPermission({
        roleId: discordRole.id,
        channelId: discordChannel,
        roleAction: DiscordRoleAction.ALLOW,
      });

      let collection = await ctx.services.worker.collectionController.findOneCollection({
        filter: {
          contractAddress: contractAddress.toLowerCase(),
        },
      });

      if (!collection) {
        collection = await ctx.services.worker.collectionController.createCollection({
          id: ObjectId.generate(ObjectType.COLLECTION).buffer,
          data: {
            contractAddress: contractAddress.toLowerCase(),
          },
        });

        AsyncGroup.add(ctx.services.worker.syncCollection({
          collection: collection.id,
          priority: true,
        }));
      }

      const projectExists = await ctx.services.project.projectController.findOneProject({
        filter: {
          contractAddress: collection.contractAddress,
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

      const project = await ctx.services.project.projectController.createProject({
        id: ObjectId.generate(ObjectType.PROJECT).buffer,
        data: {
          name,
          description,
          contractAddress: collection.contractAddress,
          discordGuild,
          discordChannel,
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
