/* eslint-disable camelcase */
import { Grid, Flex } from '@chakra-ui/react'
import { GoogleLogin, GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login'
import { login } from '@utils/authUtils'
import { useMutation } from '@apollo/client'
import { GenerateAccessTokenByGoogleVariables, GenerateAccessTokenByGoogle } from '../types/GenerateAccessTokenByGoogle'
import { GENERATE_ACCESS_TOKEN_FROM_GOOGLE } from '@graphql/mutations/auth'
import Cookies from 'js-cookie'

export const Signup = () => {
  const [getAccessToken] = useMutation<GenerateAccessTokenByGoogle, GenerateAccessTokenByGoogleVariables>(
    GENERATE_ACCESS_TOKEN_FROM_GOOGLE,
    {
      onCompleted: (data: GenerateAccessTokenByGoogle) => {
        const accessToken = data.generateAccessTokenByGoogle.data?.accessToken
        if (accessToken) {
          login(accessToken, '/welcome')
        }
      },
    }
  )

  const responseGoogle = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    if (response.accessToken) {
      const token: string = response.accessToken as string
      getAccessToken({
        variables: {
          request: {
            accessToken: token,
          },
        },
      })
    }
    const profile = JSON.stringify(response.profileObj)
    profile && Cookies.set('google_profile', profile)
  }

  return (
    <Grid placeItems="center" h="100vh" bgGradient="linear(to-r, green.200, blue.100)">
      <Flex justify="center" alignItems="center">
        <GoogleLogin
          clientId="170683676664-p6purmiveulul6b7gcgugldqlag3tb60.apps.googleusercontent.com"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          cookiePolicy={'single_host_origin'}
        />
      </Flex>
    </Grid>
  )
}

export default Signup
