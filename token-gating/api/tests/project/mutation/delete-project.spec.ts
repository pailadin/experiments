import { Context as FixtureContext, setup, teardown } from '../../helpers/fixture';
import { TYPES } from '../../../services/project/types';
import { container } from '../../../inversify.config';
import ProjectRepository from '../../../services/project/repositories/project';
import generateProject from '../../helpers/generate-project';
import ObjectId from '../../../library/object-id';

type Context = FixtureContext & {
  projectRepository: ProjectRepository;
};

describe('Mutation.deleteProject', () => {
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

  test('should delete project', async function (this: Context) {
    const project = generateProject();
    await this.projectRepository.create({
      id: project.id,
      data: {
        ...project,
      },
    });

    const query = `
      mutation ($request: DeleteProjectRequest){
        deleteProject(request: $request)
      }
    `;

    const variables = {
      request: {
        id: new ObjectId(project.id).toString(),
      },
    };

    const response = await this.request
      .post('/graphql')
      .send({
        query, variables,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(['data', 'deleteProject'], true);
  });
});
