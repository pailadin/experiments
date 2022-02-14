import { gql } from 'apollo-server-koa';

export default gql`
type Project implements Node {
  id: ID!
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

type CreateProjectResponse {
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


input DeleteProjectRequest {
  id: ID!
}

type Mutation {
  createProject(request: CreateProjectRequest): CreateProjectResponse  @permission(roles: [ADMIN]) 
  deleteProject(request: DeleteProjectRequest): Boolean!  @permission(roles: [ADMIN]) 
}

type Query {
  projects(first: Int, after: Cursor): Connection!
}
`;
