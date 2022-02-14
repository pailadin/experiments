import { ChakraProvider } from '@chakra-ui/react'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { FC } from 'react'
import theme from 'theme'
import queryClient from '@config/queryClient'
import { QueryClientProvider } from 'react-query'
import { ApolloProvider } from '@apollo/client'
import client from '@graphql/apolloClient'

const App: FC<AppProps> = ({ Component, pageProps }) => (
  <ApolloProvider client={client}>
    <QueryClientProvider client={queryClient}>
      <Head>
        <title>{process.env.appName}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </QueryClientProvider>
  </ApolloProvider>
)

export default App
