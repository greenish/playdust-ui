import { NFTSource } from '../../search/types/OpenSearchIndex'

export type SearchMetadataOnChain = Pick<SearchMetadata, 'data' | 'mint'>

type SearchMetadata = NFTSource

export default SearchMetadata
