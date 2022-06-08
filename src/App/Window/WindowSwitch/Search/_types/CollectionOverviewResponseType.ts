import type OpenSearchCollectionSourceType from '../../../_types/OpenSearchCollectionSourceType';

interface CollectionOverviewResponseType
  extends OpenSearchCollectionSourceType {
  similar: OpenSearchCollectionSourceType[];
}

export default CollectionOverviewResponseType;
