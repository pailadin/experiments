import { Connection, Project } from '../../../../types';
import { Context } from '../../types';

export default {
  Query: {
    async projects(_: never, args: { first?: number; after?: Buffer }, ctx: Context): Promise<Connection<Project>> {
      return ctx.services.project.projectController.retrieveProjectsPage({
        ...args,
        first: args.first || 100,
      });
    },
  },
};
