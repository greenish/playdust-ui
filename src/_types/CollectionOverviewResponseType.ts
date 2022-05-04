import type OpenSearchCollectionSourceType from './OpenSearchCollectionSourceType'

interface CollectionOverviewResponseType
  extends OpenSearchCollectionSourceType {
  similar: OpenSearchCollectionSourceType[]
}

export default CollectionOverviewResponseType
