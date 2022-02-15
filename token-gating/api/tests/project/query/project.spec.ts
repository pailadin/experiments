import jsonWebToken from 'jsonwebtoken';
import { Context as FixtureContext, setup, teardown } from '../../helpers/fixture';
import { TYPES as PROJECT_TYPES } from '../../../services/project/types';
import { container } from '../../../inversify.config';
import ProjectRepository from '../../../services/project/repositories/project';
import generateProject from '../../helpers/generate-project';
import ObjectId from '../../../library/object-id';
import generateAdminAccount from '../../helpers/generate-admin-account';
import AdminAccountRepository from '../../../services/account/repositories/admin-account';
import { TYPES as GLOBAL_TYPES } from '../../../types';
import { TYPES as ACCOUNT_TYPES } from '../../../services/account/types';

type Context = FixtureContext & {
  projectRepository: ProjectRepository;
  adminAccountRepository: AdminAccountRepository
  secret: Buffer;
};

describe('Query.project', () => {
  beforeEach(async function (this: Context) {
    await setup.apply(this);
    this.secret = container.get<Buffer>(GLOBAL_TYPES.JWT_SECRET);
    this.adminAccountRepository = container.get<AdminAccountRepository>(ACCOUNT_TYPES.AdminAccountRepository);
    this.projectRepository = container.get<ProjectRepository>(PROJECT_TYPES.ProjectRepository);
  });

  afterEach(async function (this: Context) {
    await Promise.all([
      this.projectRepository.clear(),
    ]);

    await teardown.apply(this);
  });

  test('should return list of projects', async function (this: Context) {
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
    await this.projectRepository.create({
      id: project.id,
      data: {
        ...project,
        adminAccount: adminAccount.id,
      },
    });

    const query = `
      query ($first: Int){
        projects(first: $first){
          totalCount
        }
      }
    `;

    const variables = {
      first: 1,
    };

    const response = await this.request
      .post('/graphql')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        query, variables,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(['data', 'projects', 'totalCount'], 1);
  });
});
