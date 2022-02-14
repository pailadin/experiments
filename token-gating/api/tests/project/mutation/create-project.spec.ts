/* eslint-disable no-console */
import R from 'ramda';
import { Context as FixtureContext, setup, teardown } from '../../helpers/fixture';
import { TYPES } from '../../../services/project/types';
import { container } from '../../../inversify.config';
import ProjectRepository from '../../../services/project/repositories/project';
import generateProject from '../../helpers/generate-project';
import generateDiscordToken from '../../helpers/generate-discord-token';

type Context = FixtureContext & {
  projectRepository: ProjectRepository;
};

describe('Mutation.createProject', () => {
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

  test('should create project', async function (this: Context) {
    const project = generateProject();

    const discordBotAccessToken = await generateDiscordToken();

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
        ...R.omit(['id'], project),
        discordBotAccessToken,
      },
    };

    const response = await this.request
      .post('/graphql')
      .send({
        query, variables,
      });

    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty(['data', 'createProject', 'data', 'project', 'name'], project.name);
  });
});
