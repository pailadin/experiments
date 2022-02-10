import { Context as FixtureContext, setup, teardown } from '../../helpers/fixture';
import { TYPES } from '../../../services/project/types';
import { container } from '../../../inversify.config';
import ProjectRepository from '../../../services/project/repositories/project';
import generateProject from '../../helpers/generate-project';

type Context = FixtureContext & {
  projectRepository: ProjectRepository;
};

describe('Query.project', () => {
  beforeEach(async function (this: Context) {
    await setup.apply(this);

    this.projectRepository = container.get<ProjectRepository>(TYPES.ProjectRepository);
  });

  afterEach(async function (this: Context) {
    await Promise.all([
      this.projectRepository.clear(),
    ]);

    await teardown.apply(this);
  });

  test('should return list of projects', async function (this: Context) {
    const project = generateProject();
    await this.projectRepository.create({
      id: project.id,
      data: {
        ...project,
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
      .send({
        query, variables,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(['data', 'projects', 'totalCount'], 1);
  });
});
