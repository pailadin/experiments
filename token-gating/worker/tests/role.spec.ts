/* eslint-disable no-console */
import {
  Guild, GuildMember, Permissions, TextChannel,
} from 'discord.js';
import { Context as FixtureContext, setup, teardown } from './helpers/fixture';

type Context = FixtureContext & {
  secret: Buffer;
  guild: Guild;
  channel: TextChannel;
};

describe('Role Test', () => {
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

  test('should add a role to server', async function (this: Context) {
    const vipRole = await this.guild.roles.create({
      name: 'VIP',
      permissions: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.READ_MESSAGE_HISTORY],
    });

    expect(this.guild.roles.cache.find((role) => role.name === vipRole.name)).not.toBeUndefined();
  });

  test('should delete a role to server', async function (this: Context) {
    const vipRole = await this.guild.roles.create({
      name: 'VIP',
      permissions: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.READ_MESSAGE_HISTORY],
    });

    await vipRole.delete();

    expect(this.guild.roles.cache.find((role) => role.name === vipRole.name)).toBeUndefined();
  });

  test('should edit role', async function (this: Context) {
    const vipRole = await this.guild.roles.create({
      name: 'VIP',
      permissions: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.READ_MESSAGE_HISTORY],
    });

    await vipRole.setPermissions([
      Permissions.FLAGS.VIEW_CHANNEL,
      Permissions.FLAGS.READ_MESSAGE_HISTORY,
      Permissions.FLAGS.KICK_MEMBERS,
    ]);

    const roleData = this.guild.roles.cache.find((role) => role.name === vipRole.name);

    expect(roleData).not.toBeUndefined();
    expect(roleData?.permissions.has('KICK_MEMBERS')).toEqual(true);
  });

  test('should assign a role to member', async function (this: Context) {
    const guild = this.client.guilds.cache.find((x) => x.name === 'NFT TEST');
    let member:GuildMember;

    if (guild) {
      member = await guild.members.fetch('404512737876508682');

      const existingRole = member.roles.cache.find((x) => x.name === 'POWER USER');

      if (existingRole) { await existingRole.delete(); }

      const newRole = await guild.roles.create({
        name: 'POWER USER',
        permissions: [Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.READ_MESSAGE_HISTORY],
      });

      member = await member.roles.add(newRole);

      expect(member.roles.cache.has(newRole.id)).toEqual(true);
    }
  });
});
