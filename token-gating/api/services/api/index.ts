import Logger from '@highoutput/logger';
import jsonwebtoken from 'jsonwebtoken';
import { inject, injectable } from 'inversify';
import Koa from 'koa';
import nodeFetch from 'node-fetch';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import { ApolloServer } from 'apollo-server-koa';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files';
import path from 'path';
import R from 'ramda';
import { promisify } from 'util';
import { createServer, Server } from 'http';
import { ApolloError, ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import cryptoRandomString from 'crypto-random-string';
import assert from 'assert';
import AsyncGroup from '@highoutput/async-group';
import loaders from './loaders';
import { AccountRole, TYPES as GLOBAL_TYPES } from '../../types';
import { AccountService } from '../account';
import { Context, TYPES } from './types';
import ObjectId from '../../library/object-id';
import { ApplicationError } from '../../library/error';
import { ProjectService } from '../project';
import permissionDirective from './directives/permission';
import { WorkerService } from '../worker/src';
import routes from './routes';
import { DiscordService } from '../discord';

@injectable()
export class ApiService {
  private app: Koa;

  private apollo: ApolloServer;

  private server?: Server;

  constructor(
    @inject(TYPES.PORT) private readonly PORT: number,
    @inject(GLOBAL_TYPES.JWT_SECRET) private readonly JWT_SECRET: Buffer,
    @inject(TYPES.BASE_URL) private readonly BASE_URL: string,
    @inject(GLOBAL_TYPES.ENV) private readonly ENV: string,
    @inject(GLOBAL_TYPES.MONGODB_URI) private readonly MONGODB_URI: string,
    @inject(GLOBAL_TYPES.logger) private readonly logger: Logger,
    @inject(GLOBAL_TYPES.fetch) private readonly fetch: typeof nodeFetch,
    @inject(GLOBAL_TYPES.AccountService) private readonly accountService: AccountService,
    @inject(GLOBAL_TYPES.DiscordService) private readonly discordService: DiscordService,
    @inject(GLOBAL_TYPES.ProjectService) private readonly projectService: ProjectService,
    @inject(GLOBAL_TYPES.WorkerService) private readonly workerService: WorkerService,
    @inject(GLOBAL_TYPES.CLIENT_ID) private readonly CLIENT_ID: string,
    @inject(GLOBAL_TYPES.CLIENT_SECRET) private readonly CLIENT_SECRET: string,
    @inject(GLOBAL_TYPES.REDIRECT_URI) private readonly REDIRECT_URI: string,
    @inject(GLOBAL_TYPES.BOT_TOKEN) private readonly BOT_TOKEN: string,
  ) {
    this.app = new Koa();

    this.app.use(
      bodyParser({
        jsonLimit: '2mb',
      }),
    );

    this.app.use(
      cors({
        origin: '*',
        maxAge: 3600,
        credentials: true,
      }),
    );

    this.app.use(async (ctx, next) => {
      Object.assign(ctx, {
        services: {
          account: this.accountService,
          project: this.projectService,
          worker: this.workerService,
          discord: this.discordService,
        },
        config: {
          MONGODB_URI: this.MONGODB_URI,
          JWT_SECRET: this.JWT_SECRET,
          BASE_URL: this.BASE_URL,
          ENV: this.ENV,
          CLIENT_ID: this.CLIENT_ID,
          CLIENT_SECRET: this.CLIENT_SECRET,
          REDIRECT_URI: this.REDIRECT_URI,
          BOT_TOKEN: this.BOT_TOKEN,
        },
        fetch: this.fetch,
        loaders: loaders(ctx as never),
      });

      await next();
    });

    this.app.use(routes.routes());
    this.app.use(routes.allowedMethods());

    this.app.use(async (ctx: Context, next) => {
      const { authorization } = ctx.headers;
      if (!authorization) {
        await next();
        return;
      }

      const [, token] = authorization.split(' ');

      try {
        ctx.state.claims = jsonwebtoken.verify(
          token,
          this.JWT_SECRET,
        ) as typeof ctx.state.claims;

        let user;

        if (ctx.state.claims.role === AccountRole.ADMIN) {
          user = await ctx.loaders.adminAccount.load(ObjectId.from(ctx.state.claims.sub).buffer);
        }

        assert(user, '`user` is null');

        ctx.state.user = R.pick(['id', 'role'], user);
      } catch (err) {
        logger.warn(err as Error);

        ctx.status = 403;

        return;
      }

      await next();
    });

    const typeDefs = mergeTypeDefs(loadFilesSync(path.join(__dirname, './type-defs'), {
      recursive: true,
    }));

    const resolvers = mergeResolvers(loadFilesSync(path.join(__dirname, './resolvers'), {
      recursive: true,
    }) as never);

    const withDirectives = R.pipe(
      permissionDirective('permission'),
    );

    this.apollo = new ApolloServer({
      schema: withDirectives(makeExecutableSchema({
        typeDefs,
        resolvers,
      })),
      context: ({ ctx, connection }) => Object.assign(ctx || {}, R.prop('context')(connection) || {}),
      debug: true,
      introspection: true,
      plugins: [
        ApolloServerPluginLandingPageGraphQLPlayground({
          title: 'Token Gating API',
        }),
      ],
      formatError: (err) => {
        if (err.originalError instanceof ApplicationError) {
          const error = new ApolloError(err.message, 'APPLICATION_ERROR', {
            id: cryptoRandomString({
              length: 10,
            }),
            exception: err.originalError,
          });

          Object.assign(error, R.pick(['locations', 'path'], err));

          logger.error(error);

          return error;
        }

        return err;
      },
    });
  }

  async start() {
    this.logger.info(`APIService => Starting ${this.ENV}`);

    await this.apollo.start();

    this.apollo.applyMiddleware({ app: this.app });

    this.server = createServer(this.app.callback());
    this.server.listen(this.PORT);

    this.logger.info('APIService => Started');
  }

  async stop() {
    this.logger.info('APIService => Stopping');

    await this.apollo.stop();

    if (this.server) {
      await promisify(this.server.close).call(this.server);
    }

    await AsyncGroup.wait();

    this.logger.info('APIService => Stopped');
  }
}
