/* eslint-disable no-console */
import jsonwebtoken from 'jsonwebtoken';
import { ethers } from 'ethers';
import axios from 'axios';
import ObjectId, { ObjectType } from '../../../../library/object-id';
import { Context } from '../../types';
import { DiscordUserInfo } from '../../../../types/discord-userinfo';

export default {
  Mutation: {
    async generateAccessTokenByGoogle(_: never, args: {
      request: {
        accessToken: string;
      }
    }, ctx: Context) {
      const tokenInfoResponse = await axios.post('https://oauth2.googleapis.com/tokeninfo', {}, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${args.request.accessToken}`,
        },
      });

      const tokenInfo = tokenInfoResponse.data;

      if (!tokenInfo || !tokenInfo.email) {
        return {
          data: null,
          error: {
            __typename: 'InvalidGoogleAccessTokenError',
            message: 'Invalid Google Access Token',
          },
        };
      }

      let adminAccountData = await ctx.services.account.adminAccountController.findOneAdminAccount({
        filter: {
          emailAddress: tokenInfo.email,
        },
      });

      if (!adminAccountData) {
        adminAccountData = await ctx.services.account.adminAccountController.createAdminAccount({
          id: ObjectId.generate(ObjectType.ADMIN).buffer,
          data: {
            emailAddress: tokenInfo.email,
          },
        });
      }

      return {
        data: {
          accessToken: jsonwebtoken.sign(
            { role: adminAccountData.role },
            ctx.config.JWT_SECRET,
            {
              subject: new ObjectId(adminAccountData.id).toString(),
              expiresIn: '30d',
            },
          ),
        },
        error: null,
      };
    },
    async generateProjectAccessToken(_: never, args: {
      request: {
        projectId: string;
        discordAccessToken: string;
        ethAddress: string;
        timestamp: string;
        signature: string;
        ttl: string;
      }
    }, ctx: Context) {
      const {
        discordAccessToken, ethAddress, timestamp, signature,
      } = args.request;

      const message = `Timestamp: ${timestamp}`;

      const timestampBytes = ethers.utils.toUtf8Bytes(
        `\u0019Ethereum Signed Message:\n${
          message.length.toString()
        }${message}`,
        ethers.utils.UnicodeNormalizationForm.current,
      );
      const timestampHash = ethers.utils.keccak256(timestampBytes);

      const recoveredAddress = ethers.utils.verifyMessage(timestampHash, signature);

      if (ethAddress.toLowerCase() !== recoveredAddress.toLowerCase()) {
        return {
          error: {
            __typename: 'InvalidAuthenticationSignatureError',
            message: 'Invalid Authentication Signature',
          },
          data: null,
        };
      }

      const userInfo: DiscordUserInfo | null = await ctx.services.discord.getUserInfo({
        userOAuth2Token: discordAccessToken,
      });

      if (!userInfo || !userInfo.id) {
        return {
          data: null,
          error: {
            __typename: 'InvalidDiscordAccessTokenError',
            message: 'Invalid Discord Access Token',
          },
        };
      }

      const projectId = ObjectId.from(args.request.projectId).buffer;

      const project = await ctx.services.project.projectController.findOneProject({
        id: projectId,
      });

      if (!project) {
        return {
          data: null,
          error: {
            __typename: 'ProjectDoesNotExistError',
            message: 'Project does not exist',
          },
        };
      }

      const collection = await ctx.services.worker.collectionController.findOneCollection({
        filter: {
          contractAddress: project.contractAddress.toLowerCase(),
        },
      });

      if (!collection) {
        return {
          data: null,
          error: {
            __typename: 'CollectionDoesNotExistError',
            message: 'Collection does not exist',
          },
        };
      }

      const ownershipExists = await ctx.services.worker.ownershipController.findOneOwnership({
        filter: {
          owner: ethAddress.toLowerCase(),
          collectionID: collection.id,
        },
      });

      if (!ownershipExists) {
        return {
          data: null,
          error: {
            __typename: 'NftOwnershipDoesNotExistError',
            message: 'NFT Ownership does not exist',
          },
        };
      }

      let holderAccount = await ctx.services.account.holderAccountController.findOneHolderAccount({
        filter: {
          ethereumAddress: ethAddress.toLowerCase(),
          discordId: userInfo.id,
        },
      });

      if (!holderAccount) {
        const ethereumAddressExists = await ctx.services.account.holderAccountController.findOneHolderAccount({
          filter: {
            ethereumAddress: ethAddress.toLowerCase(),
          },
        });

        if (ethereumAddressExists) {
          return {
            data: null,
            error: {
              __typename: 'EthereumAddressExistsError',
              message: 'Ethereum Address exists',
            },
          };
        }

        const discordIdExists = await ctx.services.account.holderAccountController.findOneHolderAccount({
          filter: {
            discordId: userInfo.id,
          },
        });

        if (discordIdExists) {
          return {
            data: null,
            error: {
              __typename: 'DiscordIdExistsError',
              message: 'Discord ID exists',
            },
          };
        }

        holderAccount = await ctx.services.account.holderAccountController.createHolderAccount({
          id: ObjectId.generate(ObjectType.HOLDER).buffer,
          data: {
            ethereumAddress: ethAddress.toLowerCase(),
            discordId: userInfo.id,
          },
        });
      }

      await ctx.services.discord.addGuildMember({
        guildId: project.discordGuild,
        userId: userInfo.id,
        userOAuth2Token: discordAccessToken,
        roleId: project.discordRoleId,
      });

      return {
        data: {
          accessToken: jsonwebtoken.sign(
            { role: holderAccount.role },
            ctx.config.JWT_SECRET,
            {
              subject: new ObjectId(holderAccount.id).toString(),
              expiresIn: '30d',
            },
          ),
        },
        error: null,
      };
    },
  },
};
