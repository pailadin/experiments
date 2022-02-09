/* eslint-disable no-underscore-dangle */
import { Connection, Document, Schema } from 'mongoose';
import { injectable } from 'inversify';
import {
  ID,
  AdminAccount,
} from '../../../types';
import Repository from '../../../library/repository';

type AdminAccountDocument = Document<ID> & AdminAccount;

@injectable()
export default class AdminAccountRepository
  extends Repository<
  AdminAccount,
    Pick<AdminAccount, 'emailAddress'> & Partial<Pick<AdminAccount, 'createdAt' | 'updatedAt'>>,
    Partial<Pick<AdminAccount, 'id' | 'emailAddress' | 'createdAt' | 'updatedAt'>>
  > {
  async getModel(db: Connection) {
    const schema = new Schema<AdminAccountDocument>({
      _id: {
        type: Buffer,
        required: true,
      },
      emailAddress: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },

    }, { id: false, _id: false });

    schema.virtual('id').get(function (this: AdminAccountDocument) {
      return Buffer.from(this._id as never);
    });

    schema.index({ createdAt: 1 });

    return db.model<AdminAccountDocument>('AdminAccount', schema);
  }
}
