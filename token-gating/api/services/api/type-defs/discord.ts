/* eslint-disable max-len */
import { gql } from 'apollo-server-koa';

export default gql`


type DiscordChannel {
  id: String!
  name: String!  
  type: Int!
}


type InvalidDiscordGuildIdError implements Error {
  message: String!
}

union GetDiscordChannelsError = InvalidDiscordAccessTokenError | InvalidDiscordGuildIdError


type GetDiscordChannelsResponseData {
  channels: [DiscordChannel!]
}

type GetDiscordChannelsResponse {
  error: GetDiscordChannelsError
  data: GetDiscordChannelsResponseData
}

type Query {
  getDiscordChannels(guildId: String!): GetDiscordChannelsResponse!  @permission(roles: [ADMIN]) 
}
`;
