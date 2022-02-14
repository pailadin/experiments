/* eslint-disable camelcase */
export type DiscordUserInfo = {
  id?: string,
  username?: string,
  avatar?: string,
  discriminator?: string,
  public_flags?: number,
  flags?: number,
  banner?: string,
  banner_color?: string,
  accent_color?: string,
  locale?: string,
  mfa_enabled?: boolean,
  email?: string,
  verified?: boolean
};
