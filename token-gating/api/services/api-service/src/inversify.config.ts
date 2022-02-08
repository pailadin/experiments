import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES as GLOBAL_TYPES } from '../types';
import { WorkerService } from '.';
import { TYPES } from './types';
import CollectionRepository from './repositories/collection';
import OwnershipRepository from './repositories/ownership';

const container = new Container();

container.bind(TYPES.ETHERSCAN_KEY).toConstantValue('S1W3GXNSMC72X93RF6XD2VPMQVXUUC5KY2');
container.bind<CollectionRepository>(TYPES.CollectionRepository).to(CollectionRepository).inSingletonScope();
container.bind<OwnershipRepository>(TYPES.OwnershipRepository).to(OwnershipRepository).inSingletonScope();
container.bind<WorkerService>(GLOBAL_TYPES.WorkerService).to(WorkerService).inSingletonScope();
container.bind<number>(TYPES.PORT).toConstantValue(parseInt(process.env.PORT || '8080', 10));

export { container };
