import { MetadataDataData } from '@metaplex-foundation/mpl-token-metadata'

export interface OpenSearchNFTSourceType {
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

export default OpenSearchNFTSourceType
