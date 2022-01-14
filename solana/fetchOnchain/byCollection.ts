import { Account } from '@metaplex/js'
import { Metadata } from '@metaplex-foundation/mpl-token-metadata'
import {
  Connection,
  PublicKey,
} from '@solana/web3.js'
import getUrl from '../getUrl'
import {
  byCombination,
} from './filters'
import {
  MetaplexCollectionIdentifier,
  ParsedMetadata,
} from '../types'
import { METADATA_PROGRAM_ID } from '../programIds'

const byCollection = async (collection: MetaplexCollectionIdentifier): Promise<ParsedMetadata[]> => {
  const url = getUrl()
  const memFilters = byCombination(collection)

  const connection = new Connection(url)
  const raw = await connection.getProgramAccounts(
    new PublicKey(METADATA_PROGRAM_ID),
    {
      filters: memFilters,
    }
  )

  return raw.map(m => {
    const account = new Account(m.pubkey, m.account)
    const metadata = Metadata.from(account)
    const mint = new PublicKey(metadata.data.mint)

    return {
      mint: mint.toBase58(),
      pda: metadata.pubkey.toBase58(),
      onchain: metadata.data,
    }
  })
}

export default byCollection