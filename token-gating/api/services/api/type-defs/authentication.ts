/* eslint-disable max-len */
import { gql } from 'apollo-server-koa';

export default gql`

enum AccountRole {
  ADMIN
}

type InvalidGoogleAccessTokenError implements Error {
  message: String!
}


union GenerateAccessTokenByGoogleError = InvalidGoogleAccessTokenError


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

type InvalidDiscordAccessTokenError implements Error {
  message: String!
}

type InvalidAuthenticationSignatureError implements Error {
  message: String!
}

type EthereumAddressExistsError implements Error {
  message: String!
}

type DiscordIdExistsError implements Error {
  message: String!
}

type CollectionDoesNotExistError implements Error {
  message: String!
}

type NftOwnershipDoesNotExistError implements Error {
  message: String!
}

type ProjectDoesNotExistError implements Error {
  message: String!
}

union GenerateProjectAccessTokenError = InvalidDiscordAccessTokenError | InvalidAuthenticationSignatureError | EthereumAddressExistsError | DiscordIdExistsError | CollectionDoesNotExistError | NftOwnershipDoesNotExistError | ProjectDoesNotExistError


type GenerateProjectAccessTokenResponseData {
  accessToken: String!
}

type GenerateProjectAccessTokenResponse {
  error: GenerateProjectAccessTokenError
  data: GenerateProjectAccessTokenResponseData
}

input GenerateProjectAccessTokenRequest {
  projectId: ID!
  discordAccessToken: String!
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
