/* eslint-disable no-underscore-dangle */
import bs58 from 'bs58';
import crypto from 'crypto';

export enum ObjectType {
  COLLECTION = 0,
  OWNERSHIP = 1,
  ADMIN = 2,
  PROJECT = 3,
}

export default class ObjectId {
  public readonly buffer: Buffer;

  constructor(value: Buffer) {
    this.buffer = value;
  }

  static from(value: string) {
    return new ObjectId(bs58.decode(value));
  }

  static generate(type: ObjectType) {
    return new ObjectId(Buffer.concat([
      Buffer.from([type]),
      crypto.randomBytes(15),
    ]));
  }

  toString() {
    return bs58.encode(this.buffer);
  }

  get type(): ObjectType {
    return this.buffer[0];
  }
}
