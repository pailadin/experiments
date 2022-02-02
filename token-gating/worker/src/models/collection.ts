import { Schema, model } from 'mongoose';
import hash from '@highoutput/hash';

export type Collection = Document & {
  contractAddress: string;
  status: string;
  block: string;
  cursor: {
    block: Buffer;
  }
};

const collectionSchema = new Schema({
  contractAddress: { type: String, required: true },
  status: { type: String },
  block: { type: String },
  cursor: {
    type: Buffer,
    default(this: Collection) {
      const { block } = this;
      const buffer = Buffer.alloc(6, 0);
      return Buffer.concat([buffer, hash(block).slice(0, 4)]);
    },
  },
});

export default model<Collection>('Collection', collectionSchema);
