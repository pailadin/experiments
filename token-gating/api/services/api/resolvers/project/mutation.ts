/* eslint-disable no-console */

import R from 'ramda';
import AsyncGroup from '@highoutput/async-group';
import axios from 'axios';
import ObjectId, { ObjectType } from '../../../../library/object-id';
import { Context } from '../../types';
import logger from '../../../../library/logger';
import { DiscordUserInfo } from '../../../../types/discord-userinfo';

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

      const userInfoQueryResponse = await axios.get('https://discord.com/api/users/@me', {
        headers: {
          Authorization: `Bearer ${discordAccessToken}`,
        },
      });

      const userInfo: DiscordUserInfo = userInfoQueryResponse.data;

      if (!userInfo.id) {
        return {
          data: null,
          error: {
            __typename: 'InvalidDiscordAccessTokenError',
            message: 'Invalid Discord Access Token',
          },
        };
      }

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

      const project = await ctx.services.project.projectController.createProject({
        id: ObjectId.generate(ObjectType.PROJECT).buffer,
        data: {
          name,
          description,
          contractAddress,
          discordGuild,
          discordChannel,
          discordAccessToken,
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
