import {
  CollectionSource,
  CollectionSourceHighlight,
  NFTSource,
} from './OpenSearchIndex'

export type AttributeResponse = {
  trait: string
  options: string[]
}[]

export interface SearchResponse {
  nfts: NFTSource[]
  cursor: string
  total: number
}

export interface SearchSuggestionResponse {
  collections: CollectionSourceHighlight[]
  attributes: {
    names: string[]
    values: string[]
  }
}

export type SearchCursorResponse = Pick<SearchResponse, 'nfts' | 'cursor'>

export interface CollectionOverviewResponse extends CollectionSource {
  similar: CollectionSource[]
}

export interface SearchOverviewResponse {
  listed: number
  floor: number
  ceiling: number
  count: number
}

export interface SearchAggregationResponse {
  attributes: AttributeResponse
}
