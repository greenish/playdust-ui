import { NFTSource } from '../src/search/types/OpenSearchIndex'

export type SearchMetadataOnChain = Pick<SearchMetadata, 'data' | 'mint'>

type SearchMetadata = NFTSource

export default SearchMetadata
