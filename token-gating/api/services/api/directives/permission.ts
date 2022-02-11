import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils';
import { ForbiddenError } from 'apollo-server-errors';
import { defaultFieldResolver, GraphQLSchema } from 'graphql';
import { ApplicationError } from '../../../library/error';

export default function permissionDirective(directiveName: string) {
  return (schema: GraphQLSchema) => mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
      const { resolve = defaultFieldResolver } = fieldConfig;

      const [directive] = getDirective(schema, fieldConfig, directiveName) || [];

      if (!directive) {
        return undefined;
      }

      const { roles } = directive;

      return {
        ...fieldConfig,
        resolve(source, args, ctx, info) {
          if (!ctx.state.user) {
            throw new ForbiddenError('Authorization is required.');
          }

          if (!roles.includes(ctx.state.user.role)) {
            throw new ApplicationError('Z00003', 'User must have the right permission.');
          }

          return resolve(source, args, ctx, info);
        },
      };
    },
  });
}
