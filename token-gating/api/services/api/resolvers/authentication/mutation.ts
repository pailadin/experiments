/* eslint-disable no-console */
import jsonwebtoken from 'jsonwebtoken';
import ObjectId, { ObjectType } from '../../../../library/object-id';
import { Context } from '../../types';

export default {
  Mutation: {
    async generateAccessTokenByGoogle(_: never, args: {
      request: {
        accessToken: string;
      }
    }, ctx: Context) {
      const emailAddress = '';

      if (!emailAddress) {
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
          emailAddress,
        },
      });

      if (!adminAccountData) {
        adminAccountData = await ctx.services.account.adminAccountController.createAdminAccount({
          id: ObjectId.generate(ObjectType.ADMIN).buffer,
          data: {
            emailAddress,
          },
        });
      }

      return {
        data: {
          accessToken: jsonwebtoken.sign(
            { },
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
