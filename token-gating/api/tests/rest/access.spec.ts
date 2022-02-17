/* eslint-disable no-console */
import jsonWebToken from 'jsonwebtoken';
import { Context as FixtureContext, setup, teardown } from '../helpers/fixture';
import { TYPES as PROJECT_TYPES } from '../../services/project/types';
import { container } from '../../inversify.config';
import ProjectRepository from '../../services/project/repositories/project';
import HolderAccountRepository from '../../services/account/repositories/holder-account';
import { TYPES as GLOBAL_TYPES } from '../../types';
import { TYPES as ACCOUNT_TYPES } from '../../services/account/types';
import generateProject from '../helpers/generate-project';
import generateHolderAccount from '../helpers/generate-holder-account';
import ObjectId from '../../library/object-id';

type Context = FixtureContext & {
  projectRepository: ProjectRepository;
  holderAccountRepository: HolderAccountRepository;
  secret: Buffer;
};

describe('Redirect access endpoint', () => {
  beforeEach(async function (this: Context) {
    await setup.apply(this);

    this.holderAccountRepository = container.get<HolderAccountRepository>(ACCOUNT_TYPES.HolderAccountRepository);
    this.projectRepository = container.get<ProjectRepository>(PROJECT_TYPES.ProjectRepository);
    this.secret = container.get<Buffer>(GLOBAL_TYPES.JWT_SECRET);
  });

  afterEach(async function (this: Context) {
    await Promise.all([
      this.projectRepository.clear(),
      this.holderAccountRepository.clear(),
    ]);

    await teardown.apply(this);
  });

  test('should redirect url', async function (this: Context) {
    const project = generateProject();
    await this.projectRepository.create({
      id: project.id,
      data: {
        ...project,
      },
    });

    const holderAccount = generateHolderAccount();

    await this.holderAccountRepository.create({
      id: holderAccount.id,
      data: {
        ...holderAccount,
      },
    });

    const projectAccessToken = jsonWebToken.sign(
      { role: holderAccount.role },
      this.secret,
      {
        subject: new ObjectId(holderAccount.id).toString(),
        expiresIn: '30d',
      },
    );

    const response = await this.request
      .get('/access')
      .query({
        accessToken: projectAccessToken,
        projectId: new ObjectId(project.id).toString(),
      });

    expect(response.status).toEqual(302);
  });
});
