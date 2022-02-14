import { gql } from '@apollo/client'

export const GENERATE_ACCESS_TOKEN_FROM_GOOGLE = gql`
  mutation GenerateAccessTokenByGoogle($request: GenerateAccessTokenByGoogleRequest) {
    generateAccessTokenByGoogle(request: $request) {
      data {
        accessToken
      }
      error {
        __typename
      }
    }
  }
`
