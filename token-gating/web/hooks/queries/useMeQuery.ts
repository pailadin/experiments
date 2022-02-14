import { useQuery } from '@apollo/client'
import { ME } from '@graphql/queries/me'
import { isBrowser } from '@utils/envUtils'
import { Member } from 'types'

const useMeQuery = () => {
  const { data, refetch, loading } = useQuery<{ me: Member }>(ME, {
    skip: !isBrowser,
  })
  return {
    me: data?.me,
    refetchMe: refetch,
    loadingMe: loading,
  }
}

export default useMeQuery
