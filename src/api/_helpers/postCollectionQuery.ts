import type OpenSearchCollectionSourceType from '../../_types/OpenSearchCollectionSourceType'
import makePostQuery from './makePostQuery'

const postCollectionQuery =
  makePostQuery<OpenSearchCollectionSourceType>('nft-collection')

export default postCollectionQuery
