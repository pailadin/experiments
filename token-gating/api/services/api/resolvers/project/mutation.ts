/* eslint-disable no-console */

import R from 'ramda';
import AsyncGroup from '@highoutput/async-group';
import fetch from 'node-fetch';
import withQuery from 'with-query';
import ObjectId, { ObjectType } from '../../../../library/object-id';
import { Context } from '../../types';
import { DiscordToken } from '../../../../types/discord-token';
import logger from '../../../../library/logger';

export default {
  Mutation: {
    async createProject(_: never, args: {
      request: {
        name: string;
        description: string;
        contractAddress: string;
        discordGuild:string;
        discordChannel: string;
        discordAuthorizationCode: string;
      }
    }, ctx: Context) {
      const {
        name, description, contractAddress, discordGuild, discordChannel, discordAuthorizationCode,
      } = args.request;

      const requestBody = {
        client_id: ctx.config.CLIENT_ID,
        client_secret: ctx.config.CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: discordAuthorizationCode,
        redirect_uri: ctx.config.REDIRECT_URI,
      };

      const tokenQueryResponse = await fetch('https://discord.com/api/v8/oauth2/token', {
        method: 'POST',
        body: withQuery(null, requestBody).slice(1),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const discordToken: DiscordToken = await tokenQueryResponse.json();

      if (!discordToken || !discordToken.access_token) {
        logger.warn('Invalid Discord Authorization Code');
        return {
          data: null,
          error: {
            __typename: 'InvalidDiscordAuthorizationCodeError',
            message: 'Invalid Discord Authorization Code',
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
          discordAccessToken: discordToken.access_token,
          discordRefreshToken: discordToken.refresh_token,
          discordTokenExpiration: discordToken.expires_in.toString(),
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
