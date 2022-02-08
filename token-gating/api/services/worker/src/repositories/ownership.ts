/* eslint-disable no-underscore-dangle */
import { Connection, Document, Schema } from 'mongoose';
import { injectable } from 'inversify';
import {
  ID,
  Ownership,
} from '../../types';
import Repository from '../../library/repository';

type OwnershipDocument = Document<ID> & Ownership;

@injectable()
export default class OwnershipRepository
  extends Repository<
  Ownership,
    Pick<Ownership, 'collectionID' | 'tokenID' |'owner' | 'timestamp'> & Partial<Pick<Ownership, 'createdAt'>>,
    Partial<Pick<Ownership, 'id' | 'collectionID'| 'tokenID' | 'owner' | 'timestamp'| 'createdAt'>>
  > {
  async getModel(db: Connection) {
    const schema = new Schema<OwnershipDocument>({
      _id: {
        type: Buffer,
        required: true,
      },
      collectionID: {
        type: Buffer,
        required: true,
      },
      tokenID: {
        type: String,
        required: true,
      },
      owner: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Number,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },

    }, { id: false, _id: false });

    schema.virtual('id').get(function (this: OwnershipDocument) {
      return Buffer.from(this._id as never);
    });

    schema.index({ createdAt: 1 });

    return db.model<OwnershipDocument>('Ownership', schema);
  }
}
