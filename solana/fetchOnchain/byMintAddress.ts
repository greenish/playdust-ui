import { Metadata } from '@metaplex-foundation/mpl-token-metadata'
import { Connection } from '@solana/web3.js'
import type SearchMetadata from '../../types/SearchMetadata'
import fetchOffchain from '../fetchOffchain'

const getMetadataByMintAddress = async (
  endpoint: string,
  mint: string
): Promise<SearchMetadata | undefined> => {
  try {
    const connection = new Connection(endpoint)
    const pda = await Metadata.getPDA(mint)
    const { data } = await Metadata.load(connection, pda)
    const offChainData = await fetchOffchain(data.data.uri)

    return {
      mint,
      data: data.data,
      offChainData,
    }
  } catch (e) {
    console.error(e)
  }
}

export default getMetadataByMintAddress
