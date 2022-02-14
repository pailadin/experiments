import Router from '@koa/router';
import { DefaultContext, DefaultState } from 'koa';
import accessRoute from './access';

const router = new Router<DefaultState, DefaultContext>();

[accessRoute].forEach((route) => route(router));

export default router;
