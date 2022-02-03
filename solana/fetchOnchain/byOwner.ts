import { Metadata } from '@metaplex-foundation/mpl-token-metadata'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { Connection, PublicKey } from '@solana/web3.js'
import { ParsedOnchain } from '../types'

const getTokensByOwner = async (
  connection: Connection,
  owner: PublicKey
): Promise<ParsedOnchain[]> => {
  const tokens = await connection.getParsedTokenAccountsByOwner(owner, {
    programId: TOKEN_PROGRAM_ID,
  })

  return await Promise.all(
    tokens.value
      .filter((t) => {
        const amount = t.account.data.parsed.info.tokenAmount

        return amount.decimals === 0 && amount.uiAmount === 1
      })
      .map(async (token) => {
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
