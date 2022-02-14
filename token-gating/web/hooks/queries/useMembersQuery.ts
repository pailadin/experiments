import { useQuery } from '@apollo/client'
import { MEMBERS } from '@graphql/queries/member'
import { isBrowser } from '@utils/envUtils'
import { Member } from 'types'

const useMembersQuery = () => {
  const { data, refetch, loading } = useQuery<{ members: Member[] }>(MEMBERS, {
    skip: !isBrowser,
  })
  return {
    members: data?.members || [],
    refetchMembers: refetch,
    loadingMembers: isBrowser ? loading : true,
  }
}

export default useMembersQuery
