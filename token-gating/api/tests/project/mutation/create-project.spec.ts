/* eslint-disable no-console */
import R from 'ramda';
import nock from 'nock';
import faker from 'faker';
import jsonWebToken from 'jsonwebtoken';
import { Context as FixtureContext, setup, teardown } from '../../helpers/fixture';
import { TYPES as PROJECT_TYPES } from '../../../services/project/types';
import { container } from '../../../inversify.config';
import ProjectRepository from '../../../services/project/repositories/project';
import AdminAccountRepository from '../../../services/account/repositories/admin-account';
import generateProject from '../../helpers/generate-project';
import { TYPES as GLOBAL_TYPES } from '../../../types';
import { TYPES as ACCOUNT_TYPES } from '../../../services/account/types';
import ObjectId from '../../../library/object-id';
import generateAdminAccount from '../../helpers/generate-admin-account';

type Context = FixtureContext & {
  projectRepository: ProjectRepository;
  adminAccountRepository: AdminAccountRepository;
  secret: Buffer;
};

describe('Mutation.createProject', () => {
  beforeEach(async function (this: Context) {
    await setup.apply(this);

    this.adminAccountRepository = container.get<AdminAccountRepository>(ACCOUNT_TYPES.AdminAccountRepository);
    this.projectRepository = container.get<ProjectRepository>(PROJECT_TYPES.ProjectRepository);
    this.secret = container.get<Buffer>(GLOBAL_TYPES.JWT_SECRET);

    nock('https://discord.com').get('/api/users/@me').reply(200, {
      id: `93569146681729437${faker.datatype.number({
        min: 0,
        max: 9,
      })}`,
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

  test('should create project', async function (this: Context) {
    const adminAccount = generateAdminAccount();
    await this.adminAccountRepository.create({
      id: adminAccount.id,
      data: {
        ...adminAccount,
      },
    });
    const adminToken = jsonWebToken.sign(
      { role: adminAccount.role },
      this.secret,
      {
        subject: new ObjectId(adminAccount.id).toString(),
        expiresIn: '30d',
      },
    );

    const project = generateProject();

    const query = `
      mutation ($request: CreateProjectRequest){
        createProject(request: $request){
          data {
            project {
              name
            }
          }
        }
      }
    `;

    const variables = {
      request: {
        ...R.omit(['id', 'discordAccessToken', 'discordRefreshToken', 'discordTokenExpiration', 'adminAccount'], project),
        discordAccessToken: faker.git.commitSha(),
      },
    };

    const response = await this.request
      .post('/graphql')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        query, variables,
      });

    console.log(response);

    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty(['data', 'createProject', 'data', 'project', 'name'], project.name);
  });
});
