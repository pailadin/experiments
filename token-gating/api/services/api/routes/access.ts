import KoaRouter from '@koa/router';
import ObjectId from '../../../library/object-id';
import { Context } from '../types';

export default function (router: KoaRouter) {
  router.get('/access', async (ctx: Context) => {
    if (!ctx.query.projectId) {
      ctx.status = 400;
      ctx.body = {
        result: {
          status: 0,
          message: 'Forbidden',
        },
      };
      return;
    }

    const projectId = ObjectId.from(ctx.query.projectId as string).buffer;
    const project = await ctx.loaders.project.load(projectId);

    if (!project) {
      ctx.status = 400;
      ctx.body = {
        error: {
          status: 0,
          message: 'Forbidden',
        },
      };
      return;
    }

    ctx.status = 302;
    ctx.redirect(`https://discord.com/channels/${'serverId'}/${project.discordChannel}`);
  });
}
