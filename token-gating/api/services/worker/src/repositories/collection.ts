/* eslint-disable no-underscore-dangle */
import { Connection, Document, Schema } from 'mongoose';
import { injectable } from 'inversify';
import {
  ID,
  Collection,
  CollectionStatus,
} from '../../../../types';
import Repository from '../../../../library/repository';

type CollectionDocument = Document<ID> & Collection;

@injectable()
export default class CollectionRepository
  extends Repository<
  Collection,
    Pick<Collection, 'contractAddress' > & Partial<Pick<Collection, 'status' | 'blockNumber' | 'createdAt'>>,
    Partial<Pick<Collection, 'id' | 'contractAddress' | 'status' | 'blockNumber' | 'createdAt'>>
  > {
  async getModel(db: Connection) {
    const schema = new Schema<CollectionDocument>({
      _id: {
        type: Buffer,
        required: true,
      },
      contractAddress: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        default: CollectionStatus.INITIALIZING,
      },
      blockNumber: {
        type: String,
        default: '0',
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },

    }, { id: false, _id: false });

    schema.virtual('id').get(function (this: CollectionDocument) {
      return Buffer.from(this._id as never);
    });

    schema.index({ createdAt: 1 });

    return db.model<CollectionDocument>('Collection', schema);
  }
}
