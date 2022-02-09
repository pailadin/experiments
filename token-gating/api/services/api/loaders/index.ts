import {
  AdminAccount,
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

  };
}
