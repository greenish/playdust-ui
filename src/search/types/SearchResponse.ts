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

interface ActualHighlight {
  highlight: string
  actual: string
}

export interface SearchSuggestionResponse {
  collections: CollectionSourceHighlight[]
  attributeNames: ActualHighlight[]
  attributeValues: ActualHighlight[]
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

export type TopCollectionResponse = {
  results: {
    collection: CollectionSource
    nfts: NFTSource[]
  }[]
  cursor: string
  total: number
}
