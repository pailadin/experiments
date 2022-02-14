import { useQuery } from '@apollo/client'
import { ACCOUNT } from '@graphql/queries/account'
import { isBrowser } from '@utils/envUtils'
import { Account } from 'types'

const useAccountQuery = () => {
  const { data, refetch, loading } = useQuery<{ account: Account }>(ACCOUNT, {
    skip: !isBrowser,
  })
  return {
    account: data?.account,
    refetchAccount: refetch,
    loadingAccount: loading,
  }
}

export default useAccountQuery
