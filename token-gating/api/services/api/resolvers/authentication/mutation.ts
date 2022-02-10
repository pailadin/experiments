/* eslint-disable no-console */
import jsonwebtoken from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import ObjectId, { ObjectType } from '../../../../library/object-id';
import { Context } from '../../types';

export default {
  Mutation: {
    async generateAccessTokenByGoogle(_: never, args: {
      request: {
        accessToken: string;
      }
    }, ctx: Context) {
      const googleOAuth = new OAuth2Client();

      const tokenInfo = await googleOAuth.getTokenInfo(args.request.accessToken);

      if (!tokenInfo.email) {
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
  },
};
