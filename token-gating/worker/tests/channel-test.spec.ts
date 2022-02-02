/* eslint-disable no-console */
import { Guild, Permissions, TextChannel } from 'discord.js';
import { Context as FixtureContext, setup, teardown } from './helpers/fixture';

type Context = FixtureContext & {
  secret: Buffer;
  guild: Guild;
  channel: TextChannel;
};

describe('Channel Test', () => {
  beforeEach(async function (this: Context) {
    await setup.apply(this);

    this.guild = await this.client.guilds.create('Test Server');
    this.channel = await this.guild.channels.create('test-channel', {
      type: 'GUILD_TEXT',
    });
  });

  afterEach(async function (this: Context) {
    await this.guild.delete();
    await teardown.apply(this);
  });

  test('should add channel', async function (this: Context) {
    const sampleChannel = await this.guild.channels.create('sample-channel', {
      type: 'GUILD_TEXT',
    });

    const response = await this.guild.channels.fetch(sampleChannel.id);
    expect(response).not.toBeNull();
    expect(response).toHaveProperty(['id'], sampleChannel.id);
  });

  test('should remove channel', async function (this: Context) {
    await this.channel.delete();
    const isExist = this.guild.channels.cache.get(this.channel.id);
    expect(isExist).toBeUndefined();
  });

  test('should set private channel', async function (this: Context) {
    await this.channel.permissionOverwrites.edit(this.guild.roles.everyone, {
      VIEW_CHANNEL: false,
    });

    const permission = this.channel.permissionsFor(this.guild.roles.everyone);

    expect(permission.has([Permissions.FLAGS.VIEW_CHANNEL])).toEqual(false);
  });

  test('should add category channel', async function (this: Context) {
    const discussionsCategory = await this.guild.channels.create('Discussions', {
      type: 'GUILD_CATEGORY',
    });

    const response = await this.guild.channels.fetch(discussionsCategory.id);
    expect(response).not.toBeNull();
    expect(response).toHaveProperty(['id'], discussionsCategory.id);

    expect(response).toHaveProperty(['type'], 'GUILD_CATEGORY');
  });
});
