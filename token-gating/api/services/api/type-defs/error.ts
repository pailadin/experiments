import { gql } from 'apollo-server-koa';

export default gql`
interface Error {
  message: String!
}
`;
