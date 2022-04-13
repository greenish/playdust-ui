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
  collections: CollectionSource[]
  attributes: AttributeResponse
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
  listed: number
  similar: CollectionSource[]
}
