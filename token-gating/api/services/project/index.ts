import { injectable, inject } from 'inversify';
import ProjectController from './controllers/project';
import { TYPES } from './types';

@injectable()
export class ProjectService {
  @inject(TYPES.ProjectController) readonly projectController!: ProjectController;
}
