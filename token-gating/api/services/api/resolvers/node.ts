/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-case-declarations */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-fallthrough */
import ObjectId, { ObjectType } from '../../../library/object-id';
import {
  Node,
} from '../../../types';
import { Context } from '../types';

export default {
  Node: {
    async __resolveType(node: Node, __:never) {
      const objectId = ObjectId.from(node.id as never);
      switch (objectId.type) {
        case ObjectType.ADMIN:
          return 'Admin';
        case ObjectType.PROJECT:
          return 'Project';
        default:
          return undefined;
      }
    },
  },
  Query: {
    async node(_: never, args: { id: string }, ctx: Context) {
      const objectId = ObjectId.from(args.id);

      if (objectId.type === ObjectType.ADMIN) {
        const creatorAccount = await ctx.loaders.adminAccount.load(objectId.buffer);
        return { ...creatorAccount, id: objectId.toString() };
      }
      if (objectId.type === ObjectType.PROJECT) {
        const file = await ctx.loaders.project.load(objectId.buffer);
        return { ...file, id: objectId.toString() };
      }

      return null;
    },
  },
};
