import { CollectionSource, NFTSource } from './OpenSearchIndex'

export type AttributeResponse = {
  trait: string
  options: string[]
}[]

export interface SearchResponse {
  nfts: NFTSource[]
  collections: CollectionSource[]
  attributes: AttributeResponse
  cursor: string
  total: number
}

export type SearchCursorResponse = Pick<SearchResponse, 'nfts' | 'cursor'>

interface SimilarCollection extends CollectionSource {
  volume: number
}

export interface CollectionOverviewResponse extends CollectionSource {
  volume: number
  listedItems: number
  floorPrice: number
  similar: SimilarCollection[]
}
