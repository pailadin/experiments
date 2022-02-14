import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, Observable, Operation } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { getClientAccessToken, isClientLoggedIn } from '@utils/authUtils'
import { isBrowser } from '@utils/envUtils'
import { showToast } from '@utils/toastUtils'
import possibleTypes from './possibleTypes.json'
import typePolicies from './typePolicies'

const request = async (operation: Operation) => {
  operation.setContext({
    ...(isBrowser &&
      isClientLoggedIn() && {
        headers: {
          authorization: `Bearer ${getClientAccessToken()}`,
        },
      }),
  })
}

const requestLink = new ApolloLink(
  (operation, forward) =>
    new Observable((observer) => {
      let handle: ZenObservable.Subscription | undefined
      Promise.resolve(operation)
        .then((oper) => request(oper))
        .then(() => {
          handle = forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer),
          })
        })
        .catch(observer.error.bind(observer))

      return () => {
        if (handle) handle.unsubscribe()
      }
    })
)

const client = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors?.length) {
        const { extensions, message } = graphQLErrors[0]
        if (extensions) {
          switch (extensions.code) {
            case 'INVALID_TOKEN': {
              showToast('Invalid access token.', 'error')
              window.location.href = '/login?error=INVALID_TOKEN'
            }
          }
        }
        if (message) {
          showToast(message, 'error')
        }
      }
      // eslint-disable-next-line no-console
      if (networkError) console.log(networkError)
    }),
    requestLink,
    new HttpLink({
      uri: process.env.NEXT_PUBLIC_API_URL,
      credentials: 'same-origin',
    }),
  ]),
  cache: new InMemoryCache({ possibleTypes, typePolicies }),
  ssrMode: !isBrowser,
})

export default client
