/* eslint-disable no-console */
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

    console.log('generateProject');

    const discordBotAccessToken = await generateDiscordToken();

    console.log('generateDiscordToken');

    const query = `
      mutation ($request: CreateProjectRequest){
        createProject(request: $request){
          data: {
            name
            description
          }
        }
      }
    `;

    const variables = {
      request: {
        ...project,
        discordBotAccessToken,
      },
    };

    console.log(variables);

    const response = await this.request
      .post('/graphql')
      .send({
        query, variables,
      });

    console.log(response);
  });
});
