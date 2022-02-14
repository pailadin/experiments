/* eslint-disable no-restricted-syntax */
import DataLoader from 'dataloader';
import { ID, Node } from '../types';

export default class BasicDataLoader<TEntity extends Node> extends DataLoader<ID, TEntity | null> {
  constructor(handler: (ids: ID[]) => Promise<TEntity[]>) {
    super(async (ids) => {
      const map = new Map<string, Node>((await handler(ids as Buffer[]))
        .map((document) => [document.id.toString('base64'), document]));

      return ids.map((id) => map.get(id.toString('base64')) || null) as (TEntity | null)[];
    });
  }
}
