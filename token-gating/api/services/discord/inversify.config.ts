import 'reflect-metadata';
import { Container } from 'inversify';
import { DiscordService } from '.';
import { TYPES } from '../../types';

const container = new Container();

container.bind<DiscordService>(TYPES.DiscordService).to(DiscordService).inSingletonScope();

export { container };
