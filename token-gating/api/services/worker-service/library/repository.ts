/* eslint-disable no-underscore-dangle */
import { inject, injectable } from 'inversify';
import {
  Connection, Document, Model,
} from 'mongoose';
import R from 'ramda';
import {
  TYPES, Node, ID, InputData,
} from '../types';

export type QuerySelector<T> = {
  $eq?: T | undefined;
  $gt?: T | undefined;
  $gte?: T | undefined;
  $in?: T[] | undefined;
  $lt?: T | undefined;
  $lte?: T | undefined;
  $ne?: T | undefined;
  $nin?: T[] | undefined;
  $not?: T extends string ? QuerySelector<T> | RegExp : QuerySelector<T> | undefined;
  $exists?: boolean | undefined;
  $regex?: T extends string ? RegExp | string : never | undefined;
  $size?: T extends ReadonlyArray<unknown> ? number : never | undefined;
  $elemMatch?: T extends ReadonlyArray<unknown> ? object : never;
};

export type FilterQuery<T> = {
  [U in keyof T]?: QuerySelector<T[U]> | T[U]
};

export type QueryOptions = {
  sort?: Record<string, 1 | -1> | undefined;
  skip?: number | undefined;
  limit?: number | undefined;
  projection?: Record<string, 1 | -1>;
};

@injectable()
export default abstract class Repository<
  TEntity extends Node = Node,
  TCreate extends Partial<Omit<TEntity, 'id'>> = Omit<TEntity, 'id'>,
  TUpdate extends Partial<Omit<TEntity, 'id'>> = Partial<Omit<TEntity, 'id'>>,
  > {
  @inject(TYPES.mongoose) private mongooose!: Promise<Connection>;

  private _model: Promise<Model<Document & TEntity>> | null = null;

  abstract getModel(db: Connection): Promise<Model<Document & TEntity>>;

  protected serializeObject(document: Document) {
    let raw: unknown = document;
    if (document.toObject) {
      raw = document.toObject({ virtuals: true });
    }

    type Binary = {
      _bsontype: 'Binary',
      buffer: Buffer
    };

    const obj = {
      ...R.omit(['_id', '__v'], raw),
      id: (raw as { _id: Binary })._id.buffer,
    } as Record<string, unknown>;

    return R.reduce((accum, [type, value]) => {
      if (value && typeof value === 'object' && value._bsontype === 'Binary') {
        return {
          ...accum,
          [type]: value.buffer,
        };
      }

      return {
        ...accum,
        [type]: value,
      };
    }, {}, R.toPairs(obj) as [string, Binary][]) as TEntity;
  }

  get model(): Promise<Model<Document & TEntity>> {
    if (!this._model) {
      this._model = (async () => {
        const db = await this.mongooose;
        return this.getModel(db);
      })();
    }

    return this._model;
  }

  async find(params: {
    filter: FilterQuery<TEntity>,
    options?: QueryOptions
  } & Partial<QueryOptions>): Promise<TEntity[]> {
    const model = await this.model;

    const documents = await model.find({
      ...R.omit(['id'], params.filter),
      ...(params.filter.id ? { _id: params.filter.id } : {}),
    } as never, null, params.options || R.omit(['filter'], params));

    return documents.map((document) => this.serializeObject(document));
  }

  async findOne(params: { id: ID }): Promise<TEntity | null>;

  async findOne(params: {
    filter: FilterQuery<TEntity>,
    sort?: Partial<Record<keyof Omit<TEntity, 'id'>, 1 | -1>>
  }): Promise<TEntity | null>;

  async findOne(params: {
    id: ID,
    filter: FilterQuery<TEntity>,
    sort: Partial<Record<keyof Omit<TEntity, 'id'>, 1 | -1>>
  }): Promise<TEntity | null> {
    const model = await this.model;

    let document;

    if (params.id) {
      document = await model.findById(params.id);
    } else {
      const findOne = () => {
        const query = model.findOne(R.filter(Boolean)({
          ...R.omit(['id'], params.filter),
          _id: params.filter.id,
        }) as never);

        if (!params.sort) {
          return query;
        }

        return query.sort(params.sort);
      };

      document = await findOne();
    }

    if (!document) {
      return null;
    }

    return this.serializeObject(document);
  }

  async deleteOne(params: { id: ID }): Promise<void>;

  async deleteOne(params: { filter: FilterQuery<TEntity> }): Promise<void>;

  async deleteOne(params: { id: ID, filter: FilterQuery<TEntity> }): Promise<void> {
    const model = await this.model;

    if (params.id) {
      await model.findByIdAndDelete(params.id);
    } else {
      await model.deleteOne({
        ...R.omit(['id'], params.filter),
        ...(params.filter.id ? { _id: params.filter.id } : {}),
      } as never);
    }
  }

  async delete(params: { filter: FilterQuery<TEntity> }): Promise<void> {
    const model = await this.model;

    await model.deleteMany({
      ...R.omit(['id'], params.filter),
      ...(params.filter.id ? { _id: params.filter.id } : {}),
    } as never);
  }

  async updateOne(
    params: { id: ID } & InputData<TUpdate>,
    options?: Partial<{ upsert: boolean, new: boolean }>,
  ): Promise<TEntity | null>;

  async updateOne(
    params: { filter: FilterQuery<TEntity> } & InputData<TUpdate>,
    options?: Partial<{ upsert: boolean, new: boolean }>,
  ): Promise<TEntity | null>;

  async updateOne(
    params: { id: ID, filter: FilterQuery<TEntity> } & InputData<TUpdate>,
    options?: Partial<{ upsert: boolean, new: boolean }>,
  ): Promise<TEntity | null> {
    const model = await this.model;

    const document = await model.findOneAndUpdate(
      (params.id ? { _id: params.id } : {
        ...R.omit(['id'], params.filter),
        ...(params.filter.id ? { _id: params.filter.id } : {}),
      }) as never,
      R.filter((value) => value !== undefined)(params.data) as never,
      {
        upsert: false,
        new: true,
        ...options,
      },
    );

    if (!document) {
      return null;
    }

    return this.serializeObject(document);
  }

  async create(params: { id: ID } & InputData<TCreate>): Promise<TEntity> {
    const model = await this.model;

    const document = await model.create({
      ...params.data,
      _id: params.id,
    }).catch((error) => {
      if (error.code === 11000) {
        throw (error);
      } else throw (error);
    });

    return this.serializeObject(document);
  }

  async exists(params: { id: ID }): Promise<boolean>;

  async exists(params: { filter: FilterQuery<TEntity> }): Promise<boolean>;

  async exists(params: { id: ID, filter: FilterQuery<TEntity> }): Promise<boolean> {
    const model = await this.model;

    return model.exists((params.id ? { _id: params.id } : {
      ...R.omit(['id'], params.filter),
      ...(params.filter.id ? { _id: params.filter.id } : {}),
    } as never) as never);
  }

  async count(params: { filter: FilterQuery<TEntity> }): Promise<number> {
    const model = await this.model;

    return model.countDocuments({
      ...R.omit(['id'], params.filter),
      ...(params.filter.id ? { _id: params.filter.id } : {}),
    } as never);
  }

  async clear() {
    const model = await this.model;

    await model.deleteMany({});
  }
}
