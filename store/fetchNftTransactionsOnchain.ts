import { selectorFamily } from 'recoil'
import * as solana from '../solana'
import { TransactionResponse } from '@solana/web3.js'

const fetchNftTransactionsOnchain = selectorFamily<
  TransactionResponse[],
  string
>({
  key: 'fetchNftTransactionsOnchain',
  get: (mint: string) => async () => {
    const result = await solana.fetchOnchain.getTransactions(mint)

    return result
  },
})

export default fetchNftTransactionsOnchain
