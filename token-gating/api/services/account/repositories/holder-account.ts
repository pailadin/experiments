/* eslint-disable no-underscore-dangle */
import { Connection, Document, Schema } from 'mongoose';
import { injectable } from 'inversify';
import {
  ID,
  HolderAccount,
} from '../../../types';
import Repository from '../../../library/repository';

type HolderAccountDocument = Document<ID> & HolderAccount;

@injectable()
export default class HolderAccountRepository
  extends Repository<
  HolderAccount,
    Pick<HolderAccount, 'ethereumAddress' | 'discordAccessToken'> & Partial<Pick<HolderAccount, 'createdAt' | 'updatedAt'>>,
    Partial<Pick<HolderAccount, 'id' | 'ethereumAddress' | 'discordAccessToken' | 'createdAt' | 'updatedAt'>>
  > {
  async getModel(db: Connection) {
    const schema = new Schema<HolderAccountDocument>({
      _id: {
        type: Buffer,
        required: true,
      },
      ethereumAddress: {
        type: String,
        required: true,
      },
      discordAccessToken: {
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

    schema.virtual('id').get(function (this: HolderAccountDocument) {
      return Buffer.from(this._id as never);
    });

    schema.index({ createdAt: 1 });

    return db.model<HolderAccountDocument>('holder', schema);
  }
}
