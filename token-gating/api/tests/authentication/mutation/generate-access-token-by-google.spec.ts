/* eslint-disable no-console */
import nock from 'nock';
import faker from 'faker';
import { Context as FixtureContext, setup, teardown } from '../../helpers/fixture';
import { TYPES as PROJECT_TYPES } from '../../../services/project/types';
import { container } from '../../../inversify.config';
import ProjectRepository from '../../../services/project/repositories/project';
import AdminAccountRepository from '../../../services/account/repositories/admin-account';
import { TYPES as GLOBAL_TYPES } from '../../../types';
import { TYPES as ACCOUNT_TYPES } from '../../../services/account/types';

type Context = FixtureContext & {
  projectRepository: ProjectRepository;
  adminAccountRepository: AdminAccountRepository;
  secret: Buffer;
};

describe('Mutation.generateAccessTokenByGoogle', () => {
  beforeEach(async function (this: Context) {
    await setup.apply(this);

    this.adminAccountRepository = container.get<AdminAccountRepository>(ACCOUNT_TYPES.AdminAccountRepository);
    this.projectRepository = container.get<ProjectRepository>(PROJECT_TYPES.ProjectRepository);
    this.secret = container.get<Buffer>(GLOBAL_TYPES.JWT_SECRET);

    nock('https://oauth2.googleapis.com').post('/token').reply(200, {
      access_token: faker.git.commitSha(),
    }, {
      'content-type': 'application/json',
    });

    nock('https://oauth2.googleapis.com').post('/tokeninfo').reply(200, {
      email: faker.internet.email(),
    }, {
      'content-type': 'application/json',
    });
  });

  afterEach(async function (this: Context) {
    await Promise.all([
      this.projectRepository.clear(),
    ]);

    await teardown.apply(this);
  });

  test('should generate access token', async function (this: Context) {
    const accessToken = faker.git.commitSha();

    const query = `
      mutation ($request: GenerateAccessTokenByGoogleRequest){
        generateAccessTokenByGoogle(request: $request){
          data {
            accessToken
          }
        }
      }
    `;

    const variables = {
      request: {
        accessToken,
      },
    };

    const response = await this.request
      .post('/graphql')
      .send({
        query, variables,
      });

    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty(['data', 'generateAccessTokenByGoogle', 'data', 'accessToken']);
  });
});
