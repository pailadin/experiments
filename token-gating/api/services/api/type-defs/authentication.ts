/* eslint-disable max-len */
import { gql } from 'apollo-server-koa';

export default gql`

enum AccountRole {
  ADMIN
  CREATOR
  FOLLOWER
}

type InvalidGoogleAccessTokenError implements Error {
  message: String!
}

type InvalidGoogleAuthorizationCodeError implements Error {
  message: String!
}

union GenerateAccessTokenByGoogleError = InvalidGoogleAccessTokenError | InvalidGoogleAuthorizationCodeError


type GenerateAccessTokenByGoogleResponseData {
  accessToken: String!
}

type GenerateAccessTokenByGoogleResponse {
  error: GenerateAccessTokenByGoogleError
  data: GenerateAccessTokenByGoogleResponseData
}


input GenerateAccessTokenByGoogleRequest {
  accessToken: String!
}

#

type InvalidDiscordAccessTokenError implements Error {
  message: String!
}

type InvalidAuthenticationSignatureError implements Error {
  message: String!
}

union GenerateProjectAccessTokenError = InvalidDiscordAccessTokenError | InvalidAuthenticationSignatureError | InvalidDiscordAuthorizationCodeError


type GenerateProjectAccessTokenResponseData {
  accessToken: String!
}

type GenerateProjectAccessTokenResponse {
  error: GenerateProjectAccessTokenError
  data: GenerateProjectAccessTokenResponseData
}

input GenerateProjectAccessTokenRequest {
  projectId: ID!
  discordAuthorizationCode: String!
  ethAddress: String!
  timestamp: DateTime!
  signature: String!
  ttl: Duration
}

type Mutation {
  generateAccessTokenByGoogle(request: GenerateAccessTokenByGoogleRequest): GenerateAccessTokenByGoogleResponse!
  generateProjectAccessToken(request: GenerateProjectAccessTokenRequest): GenerateProjectAccessTokenResponse!
}
`;
