import { gql } from '@apollo/client'

export const CREATE_PROJECT = gql`
  mutation CreateProject($request: CreateProjectRequest) {
    createProject(request: $request) {
      data {
        project {
          name
          id
        }
      }
    }
  }
`

export const DELETE_PROJECT = gql`
  mutation DeleteProject($request: DeleteProjectRequest) {
    deleteProject(request: $request)
  }
`
