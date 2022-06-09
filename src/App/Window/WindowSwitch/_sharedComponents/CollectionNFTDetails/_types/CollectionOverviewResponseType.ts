import type OpenSearchCollectionSourceType from '../../../../_types/OpenSearchCollectionSourceType';

interface CollectionOverviewResponseType
  extends OpenSearchCollectionSourceType {
  similar: OpenSearchCollectionSourceType[];
  listed: number;
  images?: string[];
}

export default CollectionOverviewResponseType;
