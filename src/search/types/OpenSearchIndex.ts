import { MetadataDataData } from '@metaplex-foundation/mpl-token-metadata'

interface OpenSearchHighlight {
  [key: string]: string[]
}

export interface OpenSearchResponse<T> {
  _scroll_id: string
  hits: {
    total: {
      value: number
    }
    hits: {
      _source: T
      highlight?: OpenSearchHighlight
    }[]
  }
  aggregations: any
}

interface SourceHighlight<T> {
  source: T
  highlight: OpenSearchHighlight
}

export interface NFTSource {
  mint: string
  data: MetadataDataData
  updateAuthority?: string
  primarySaleHappened?: boolean
  key?: number
  offChainData: {
    name: string
    symbol: string
    external_url: string
    description: string
    seller_fee_basis_points: number
    image: string
    attributes?: {
      trait_type: string
      value: string
    }[]
    collection?: {
      name: string
      family: string
    }
  }
  heuristicCollectionId?: string
  lastListPrice?: number
  listed?: boolean
}

export type NFTSourceHighlight = SourceHighlight<NFTSource>

export interface CollectionSource {
  id: string
  symbol: string
  name: string
  description: string
  family?: string
  elementCount: number
  totalVolume: number
  floorPrice: number
}

export type CollectionSourceHighlight = SourceHighlight<CollectionSource>
