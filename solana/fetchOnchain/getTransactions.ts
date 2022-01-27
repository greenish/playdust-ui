import { Connection, PublicKey, TransactionResponse } from '@solana/web3.js'
import getUrl from '../getUrl'

const getTransactions = async (
  mint: string
): Promise<TransactionResponse[]> => {
  const url = getUrl()

  const connection = new Connection(url)
  const raw = await connection.getSignaturesForAddress(new PublicKey(mint), {
    limit: 20,
  })

  return Promise.all(
    raw.map(async (m) => {
      const transaction = await connection.getTransaction(m.signature)
      if (!transaction) {
        return {} as TransactionResponse
      }
      return transaction
    })
  )
}

export default getTransactions
