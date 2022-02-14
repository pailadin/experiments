import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES as GLOBAL_TYPES } from '../../types';
import { TYPES } from './types';
import { ProjectService } from './index';

import ProjectRepository from './repositories/project';
import ProjectController from './controllers/project';

const container = new Container();

container.bind(TYPES.ProjectRepository).to(ProjectRepository).inSingletonScope();
container.bind(TYPES.ProjectController).to(ProjectController).inSingletonScope();

container.bind(GLOBAL_TYPES.ProjectService).to(ProjectService).inSingletonScope();

export { container };
