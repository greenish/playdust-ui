import type OpenSearchCollectionSourceType from './OpenSearchCollectionSourceType';
import type OpenSearchNFTSourceType from './OpenSearchNFTSourceType';

type TopCollectionsResponseType = {
  results: {
    collection: OpenSearchCollectionSourceType;
    nfts: OpenSearchNFTSourceType[];
  }[];
  cursor: string;
  total: number;
};

export default TopCollectionsResponseType;
