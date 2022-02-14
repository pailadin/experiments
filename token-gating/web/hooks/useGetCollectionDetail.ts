import getQueries, { CollectionType } from '@services/queries'
import { useQuery } from 'react-query'

type ReturnType = {
  data: CollectionType | undefined
  isLoading: boolean
}

export const useCollectionDetail = (collectionAddress: string): ReturnType => {
  const { data, isLoading } = useQuery(
    `get-collection-detail-${collectionAddress}`,
    getQueries.getCollectionInfo(collectionAddress)
  )
  return { data, isLoading }
}

export default useCollectionDetail
