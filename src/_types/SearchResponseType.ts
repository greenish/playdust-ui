import type OpenSearchNFTSourceType from './OpenSearchNFTSourceType'

interface SearchResponseType {
  nfts: OpenSearchNFTSourceType[]
  cursor: string
  total: number
}

export default SearchResponseType
