import type OpenSearchNFTSourceType from './OpenSearchNFTSourceType';

interface SearchResponseType {
  nfts: OpenSearchNFTSourceType[];
  total: number;
  page: number;
}

export default SearchResponseType;
