/* eslint-disable max-len */
/* eslint-disable no-console */
import { MongoClient } from 'mongodb';
import ms from 'ms';

const uri = 'mongodb+srv://obiwan45:lasaw321@cluster0.2crm5.mongodb.net/admin?replicaSet=atlas-2d4d53-shard-0&readPreference=primary&connectTimeoutMS=20000&authSource=admin&authMechanism=SCRAM-SHA-1';

export const client = new MongoClient(uri, {
  readPreference: 'secondaryPreferred',
  useNewUrlParser: true,
  useUnifiedTopology: true,
  socketTimeoutMS: ms('5m'),
});
/* eslint-disable max-len */
export async function start():Promise<MongoClient> {
  await client.connect();

  console.log('Database Connected');

  return client;
}

export async function stop() {
  client.removeAllListeners();
  await client.close();
}
