import OpenSearchNFTSourceType from '../../_types/OpenSearchNFTSourceType';

export type SearchMetadataOnChain = Pick<SearchMetadata, 'data' | 'mint'>;

type SearchMetadata = OpenSearchNFTSourceType;

export default SearchMetadata;
