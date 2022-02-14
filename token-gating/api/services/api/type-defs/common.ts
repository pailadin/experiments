import { gql } from 'apollo-server-koa';

export default gql`
scalar DateTime
scalar URL
scalar EmailAddress
scalar ObjectID
scalar Cursor
scalar Duration

interface Node {
  id: ID!
}

type PageInfo {
  hasNextPage: Boolean!
  endCursor: Cursor
}

type Edge {
  cursor: Cursor!
  node: Node!
}

type Connection {
  totalCount: Int!
  edges: [Edge!]!
  pageInfo: PageInfo!
}

type Query {
  node(id: ID!): Node
}

directive @deprecated(
  reason: String = "Deprecated"
) on OBJECT | FIELD_DEFINITION | INPUT_FIELD_DEFINITION
directive @private on FIELD_DEFINITION
directive @next on OBJECT | FIELD_DEFINITION
directive @permission(roles: [AccountRole]!) on FIELD_DEFINITION
`;
