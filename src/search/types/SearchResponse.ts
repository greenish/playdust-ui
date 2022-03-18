import type SearchMetadata from '../../../types/SearchMetadata'

export interface SearchNFTResponse {
  results: SearchMetadata[]
  total: number
  cursor: string
}

export interface CollectionResponse {
  id: string
  symbol: string
  name: string
  description: string
  family?: string
  elementCount: number
}

interface SimilarCollection extends CollectionResponse {
  volume: number
}

export interface CollectionOverviewResponse extends CollectionResponse {
  volume: number
  listedItems: number
  floorPrice: number
  similar: SimilarCollection[]
}

export interface SearchCollectionResponse {
  results: CollectionResponse[]
}
