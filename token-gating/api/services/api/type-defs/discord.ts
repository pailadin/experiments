/* eslint-disable max-len */
import { gql } from 'apollo-server-koa';

export default gql`


type DiscordChannel {
  id: String!
  name: String!  
  type: Int!
}

type DiscordGuildInfo {
  id: String!
  channels: [DiscordChannel!]
}

type InvalidDiscordGuildIdError implements Error {
  message: String!
}

union GetDiscordGuildInfoError = InvalidDiscordAccessTokenError | InvalidDiscordGuildIdError


type GetDiscordGuildInfoResponseData {
  guild: DiscordGuildInfo
}

type GetDiscordGuildInfoResponse {
  error: GetDiscordGuildInfoError
  data: GetDiscordGuildInfoResponseData
}

input GetDiscordGuildInfoRequest {
  guildId: String!
}

type Mutation {
  getDiscordGuildInfo(request: GetDiscordGuildInfoRequest): GetDiscordGuildInfoResponse!  @permission(roles: [ADMIN]) 
}
`;
