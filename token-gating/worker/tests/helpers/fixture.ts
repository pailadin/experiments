import { Client } from 'discord.js';
import * as server from '../../src';

export type Context = {
 client: Client;
};

export async function setup(this: Context) {
  await server.start();
  this.client = server.clientBot;
}

export async function teardown(this: Context) {
  await server.stop();
}
