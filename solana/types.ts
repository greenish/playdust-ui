import { MetadataData } from '@metaplex-foundation/mpl-token-metadata'

export type MetaplexCollectionIdentifier = {
  symbol: string
  name?: string
  creator?: string
  updateAuthority?: string
  image?: string
}

export interface ParsedMetadata {
  mint: string
  pda: string
  onchain: MetadataData
}