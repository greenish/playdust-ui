import type SearchMetadata from '../../../types/SearchMetadata'

export interface SearchNFTResponse {
  results: SearchMetadata[]
  total: number
  cursor: string
}

export interface SearchCollectionResponse {
  results: {
    id: string
    symbol: string
    name: string
    description: string
    family?: string
  }[]
}
