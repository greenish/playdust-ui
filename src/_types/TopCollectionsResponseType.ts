import type OpenSearchCollectionSourceType from './OpenSearchCollectionSourceType';
import type OpenSearchNFTSourceType from './OpenSearchNFTSourceType';

type TopCollectionsResponseType = {
  results: {
    collection: OpenSearchCollectionSourceType;
    nfts: OpenSearchNFTSourceType[];
  }[];
  total: number;
  page: number;
};

export default TopCollectionsResponseType;
