/* eslint-disable no-console */

import R from 'ramda';
import axios from 'axios';
import AsyncGroup from '@highoutput/async-group';
import ObjectId, { ObjectType } from '../../../../library/object-id';
import { Context } from '../../types';
import { DiscordResponse } from '../../../../types/discord-response';
import logger from '../../../../library/logger';

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
        logger.warn('Invalid Discord Bot Access Token');
        return {
          data: null,
          error: {
            __typename: 'InvalidDiscordBotAccessTokenError',
            message: 'Invalid Discord Bot Access Token',
          },
        };
      }

      logger.info(`DiscordToken: ${userInfo.email}`);

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
          discordId,
          discordChannel,
          discordBotAccessToken,
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
