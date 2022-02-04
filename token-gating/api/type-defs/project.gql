import { gql } from 'apollo-server-koa';

export default gql`
type Project implements Node {
  id: ObjectID!
  name: String!
  description: String
  contractAddress: String!
  discordId: String!
  discordChannel: String!
  createdAt: DateTime!
}

type InvalidDiscordBotAccessTokenError implements Error {
  message: String!
}

union CreateProjectError = InvalidDiscordBotAccessTokenError

type CreateProjectResponseData {
  project: Project!
}

type CreateProjectleResponse {
  error: CreateProjectError
  data: CreateProjectResponseData
}

input CreateProjectRequest {
  name: String!
  description: String
  contractAddress: String!
  discordId: String!
  discordChannel: String!
  discordBotAccessToken: String!
}

type Mutation {
  createProject(request: CreateProjectRequest): CreateProjectResponse
  deleteProject(request: DeleteProjectRequest): Boolean!
}

type Mutation {
  projects(first: Int, after: Cursor): Connection!
}
`;
