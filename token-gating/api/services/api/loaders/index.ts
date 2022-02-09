import {
  AdminAccount,
  Project,
} from '../../../types';
import BasicDataLoader from '../../../library/basic-data-loader';
import { Context } from '../types';

export default function (ctx: Context) {
  return {
    adminAccount: new BasicDataLoader<AdminAccount>(async (ids) => ctx.services.account
      .adminAccountController.findAdminAccount({
        filter: {
          id: { $in: ids },
        },
      })),

    project: new BasicDataLoader<Project>(async (ids) => ctx.services.project
      .projectController.findProjects({
        filter: {
          id: { $in: ids },
        },
      })),

  };
}
