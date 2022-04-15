import { TransactionResponse } from '@solana/web3.js'
import { selectorFamily } from 'recoil'
import * as solana from '../../../solana'
import { solanaCluster } from '../../app/store'

export const fetchNftTransactionsOnchain = selectorFamily<
  TransactionResponse[],
  string
>({
  key: 'fetchNftTransactionsOnchain',
  get:
    (mint: string) =>
    async ({ get }) => {
      const { endpoint } = get(solanaCluster)
      const result = await solana.fetchOnchain.getTransactions(endpoint, mint)

      return result
    },
})
