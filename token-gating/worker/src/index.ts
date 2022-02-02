/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable no-tabs */
/* eslint-disable no-case-declarations */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-unused-vars */
import WebSocket from 'ws';
import axios from 'axios';
import PQueue from 'p-queue';
import { Zlib } from 'zlib';
import { delay } from 'bluebird';
import R from 'ramda';
import { Client, Intents, TextChannel } from 'discord.js';
import * as DiscordUser from 'discord.js-user-account';
import { MongoClient } from 'mongodb';
import * as MongoService from './mongo-service';
import { EtherScanObject } from './types/etherscan';
import { ID } from './types/node';

const ETHERSCAN_KEY = 'S1W3GXNSMC72X93RF6XD2VPMQVXUUC5KY2';
const GUILD_ID = '';

let isStop = false;

export const clientBot = new Client({
  intents: [Intents.FLAGS.GUILDS],

});

clientBot.on('ready', () => {
  if (!clientBot.user) {
    throw new Error('Unable to login');
  } else {
    console.log(`${clientBot.user.username} has Logged In`);
  }
});

const queue = new PQueue({
  concurrency: 1,
  intervalCap: 1,
  interval: 200,
});

function retrieveEvents(
  collection: ID,
  startBlock: string | null,
  endBlock: string | null,
  priority: number,
): Promise<Event[]> {
  return queue.add(async () => {
    const etherScanResponse:EtherScanObject = await axios.post(`https://api.etherscan.io/api?module=account&action=tokennfttx&contractaddress=${document.contractaddress}&page=1&startblock=${startBlock}&sort=asc&apikey=${ETHERSCAN_KEY}`);

    return etherScanResponse.result.map((transaction) => {
      const { from, to, tokenID } = transaction;

      let sender = from;
      if (sender === '0x0000000000000000000000000000000000000000') { sender = transaction.contractAddress; }

      return {
        sender,
        receiver: to,
        tokenID,
        collection,

      };
    });
  }, {
    priority,
  });
}

function digestEvents(events: Event[]): Promise<void> {

}

function syncCollection(collection: ID): Promise<void> {
  const events = retrieveEvents(collection, null, '0', 1).then((result) => result).then((result) => result).finally((results) => results);
}

async function worker() {

}

export async function start() {
  await clientBot.login('OTM1NjkxNDY2ODE3Mjk0Mzc2.YfCUlQ.XyJ454J83zXjWv2iWq2QavV6GEg');
  await MongoService.start();
  await worker();
}

export async function stop() {
  isStop = true;

  clientBot.removeAllListeners();
  clientBot.destroy();

  await MongoService.stop();
}
