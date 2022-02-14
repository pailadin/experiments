import { gql } from '@apollo/client'

export const GET_PROJECTS = gql`
  query GetProjects {
    projects {
      edges {
        node {
          ... on Project {
            contractAddress
            name
            description
            id
          }
        }
      }
      totalCount
    }
  }
`
