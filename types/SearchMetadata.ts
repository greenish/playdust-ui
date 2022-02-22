import { MetadataDataData } from '@metaplex-foundation/mpl-token-metadata'

export type SearchMetadataOnChain = Pick<SearchMetadata, 'data' | 'mint'>

export default interface SearchMetadata {
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
}
