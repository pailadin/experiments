import 'reflect-metadata';
import { Container } from 'inversify';
import fetch from 'node-fetch';
import { TYPES as GLOBAL_TYPES } from '../../types';
import { ApiService } from '.';
import { TYPES } from './types';

const container = new Container();

container.bind<typeof fetch>(GLOBAL_TYPES.fetch).toFunction(fetch);
container.bind<number>(TYPES.PORT).toConstantValue(parseInt(process.env.PORT || '8080', 10));
container.bind<string>(TYPES.ORIGIN_URL).toConstantValue(process.env.ORIGIN_URL || 'localhost');
container.bind<string>(TYPES.SCHEME).toConstantValue(process.env.SCHEME || 'http');
container.bind<string>(TYPES.BASE_URL).toDynamicValue((ctx) => {
  const scheme = ctx.container.get<string>(TYPES.SCHEME);
  const port = ctx.container.get<number>(TYPES.PORT);
  const hostname = ctx.container.get<string>(TYPES.ORIGIN_URL);

  return `${scheme}://${hostname}${(port && port !== 80) ? `:${port}` : ''}`;
}).inSingletonScope();

container.bind<ApiService>(GLOBAL_TYPES.ApiService).to(ApiService).inSingletonScope();

export { container };
