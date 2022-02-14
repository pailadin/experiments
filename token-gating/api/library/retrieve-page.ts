import {
  Model, Document, FilterQuery, PipelineStage,
} from 'mongoose';
import R from 'ramda';
import LRUCache from 'lru-cache';
import objectHash from 'object-hash';
import { Connection } from '../types';

export default async function retrievePage<
  TNode = Record<string, unknown>,
  TDocument extends Document = Document,
>(
  model: Model<TDocument>,
  params: {
    first?: number | null;
    after?: Buffer | null;
    filter?: FilterQuery<TDocument>;
  },
  options: {
    cursorKey?: string;
    sortDirection?: 'ASC' | 'DESC';
    transform?: (document: TDocument) => TNode | Promise<TNode>;
    totalCount?: boolean;
    totalCountCache?: LRUCache<string, Promise<number>>;
    search?: string[];
  } = {},
): Promise<Connection<TNode>> {
  const transform = options.transform || ((document: Document) => document);

  const sortDirection = options.sortDirection === 'ASC' ? 1 : -1;

  const cursorKey = options.cursorKey || 'cursor';

  const limit = params.first || 10000;

  const filter: FilterQuery<TDocument | null> = params.filter || {};

  let totalCount: number | undefined;

  const pipeline: PipelineStage[] = [];

  if (options.search) {
    pipeline.unshift({
      $match: { $text: { $search: options.search.join(' ') } },
    });
  }

  if (options.totalCount || R.isNil(options.totalCount)) {
    let promise: Promise<number> | undefined;

    const getTotalCount = async () => {
      const results = await model
        .aggregate<{ count: number }>([
          ...pipeline,
          { $match: filter },
          { $count: 'count' },
        ])
        .allowDiskUse(true);

      return results[0]?.count || 0;
    };

    if (options.totalCountCache) {
      const key = objectHash({ pipeline, filter, model: model.modelName });

      promise = options.totalCountCache.get(key);

      if (!promise) {
        promise = getTotalCount();

        options.totalCountCache.set(key, promise);
      }
    } else {
      promise = getTotalCount();
    }

    totalCount = await promise;
  }

  const cursorCriteria = (
    field: Buffer,
  ): {
    [key: string]: Buffer;
  } => ({
    [sortDirection === 1 ? '$gt' : '$lt']: field,
  });

  const addCursorFilter = (
    initialFilter: FilterQuery<TDocument>,
    after: Buffer,
  ): FilterQuery<null> => {
    if (initialFilter.$and) {
      return {
        $and: [...initialFilter.$and as never, { [cursorKey]: cursorCriteria(after) }],
      } as never;
    }

    return {
      ...initialFilter,
      [cursorKey]: cursorCriteria(after),
    } as never;
  };

  let query = R.clone(filter);

  if (params.after) {
    query = addCursorFilter(filter, params.after);
  }

  const sort = { [cursorKey]: sortDirection } as Record<string, 1 | -1>;

  const documents: TDocument[] = await model
    .aggregate([
      ...pipeline,
      { $match: query },
      { $sort: sort },
      { $limit: limit + 1 },
    ])
    .allowDiskUse(true);

  const getCursor = R.path<Buffer>(cursorKey.split('.'));

  const hasNextPage = documents.length === limit + 1;
  const nodes = hasNextPage ? documents.slice(0, -1) : documents;

  const edges = await Promise.all(
    R.map<TDocument, Promise<{ node: TNode; cursor: Buffer }>>(
      async (item) => ({
        node: (await transform(item)) as TNode,
        cursor: getCursor(item) as Buffer,
      }),
    )(nodes),
  );

  const endCursor = edges.length > 0
    ? R.prop('cursor')(R.last(edges) as { cursor: Buffer })
    : null;
  const startCursor = edges.length > 0
    ? R.prop('cursor')(R.head(edges) as { cursor: Buffer })
    : null;

  return {
    totalCount,
    edges,
    pageInfo: {
      startCursor,
      endCursor,
      hasNextPage,
    },
  };
}
