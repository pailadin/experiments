import KoaRouter from '@koa/router';
import jsonWebToken from 'jsonwebtoken';
import ObjectId from '../../../library/object-id';
import { Context } from '../types';

export default function (router: KoaRouter) {
  router.get('/access', async (ctx: Context) => {
    const forbiddenData = {
      result: {
        status: 400,
        message: 'Forbidden',
      },
    };

    if (!ctx.query.projectId || !ctx.query.accessToken) {
      ctx.status = 400;
      ctx.body = {
        ...forbiddenData,
      };
      return;
    }

    const claims = jsonWebToken.verify(
      ctx.query.accessToken as string,
      ctx.config.JWT_SECRET,
    ) as typeof ctx.state.claims;

    const holderAccount = await ctx.loaders.holderAccount.load(ObjectId.from(claims.sub).buffer);

    if (!holderAccount) {
      ctx.status = 400;
      ctx.body = {
        ...forbiddenData,
      };
      return;
    }

    const projectId = ObjectId.from(ctx.query.projectId as string).buffer;
    const project = await ctx.loaders.project.load(projectId);

    if (!project) {
      ctx.status = 400;
      ctx.body = {
        ...forbiddenData,
      };
      return;
    }

    ctx.status = 302;
    ctx.redirect(`https://discord.com/channels/${project.discordGuild}/${project.discordChannel}`);
  });
}
