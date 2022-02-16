import { Connection, TransactionResponse } from '@solana/web3.js'
import { selectorFamily, useRecoilValue } from 'recoil'
import solanaCluster from './solanaCluster'

export const fetchTransaction = selectorFamily<
  TransactionResponse | null,
  string
>({
  key: 'transaction',
  get:
    (signature) =>
    async ({ get }) => {
      const { endpoint } = get(solanaCluster)
      const connection = new Connection(endpoint)

      return await connection.getTransaction(signature)
    },
})

export const useTransaction = (signature: string) =>
  useRecoilValue(fetchTransaction(signature))
