import { Schema, model } from 'mongoose';
import hash from '@highoutput/hash';

export type Ownership = Document & {
  id: Buffer;
  collection: Buffer;
  tokenID: string;
  owner: string;
};

const ownershipSchema = new Schema({
  collection: { type: String, required: true },
  status: { type: String },
  block: { type: String },
  cursor: {
    type: Buffer,
    default(this: Ownership) {
      const { block } = this;
      const buffer = Buffer.alloc(6, 0);
      return Buffer.concat([buffer, hash(block).slice(0, 4)]);
    },
  },
});

export default model<Collection>('Collection', collectionSchema);
