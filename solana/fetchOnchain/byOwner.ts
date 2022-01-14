import {
  Metadata,
} from '@metaplex-foundation/mpl-token-metadata'
import {
  Connection,
  PublicKey,
} from '@solana/web3.js'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import getUrl from '../getUrl'
import { ParsedMetadata } from '../types'

const getTokensByOwner = async (owner: PublicKey): Promise<ParsedMetadata[]> => {
  // const url = getUrl()
  const url = 'https://api.devnet.solana.com'

  const connection = new Connection(url)
  const tokens = await connection.getParsedTokenAccountsByOwner(
    owner,
    {
      programId: TOKEN_PROGRAM_ID,
    },
  )

  return await Promise.all(
    tokens.value
      .map(async token => {
        const mint = new PublicKey(token.account.data.parsed.info.mint)
        const pda = await Metadata.getPDA(mint)
        const onchain = await Metadata.load(connection, pda)

        return {
          mint: mint.toBase58(),
          pda: pda.toBase58(),
          onchain: onchain.data,
        }
      })
  )
}

export default getTokensByOwner