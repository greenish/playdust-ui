import {
  Connection,
  Message,
  ParsedConfirmedTransaction,
  Transaction,
  TransactionResponse,
} from '@solana/web3.js'
import { selectorFamily, useRecoilValue } from 'recoil'
import solanaCluster from '../../App/_atoms/solanaCluster'

export const fetchParsedConfirmedTransaction = async (
  endpoint: string,
  signature: string
) => {
  const connection = new Connection(endpoint)

  return await connection.getParsedConfirmedTransaction(signature)
}

export const fetchRawTransactionSelector = selectorFamily<
  TransactionResponse | null,
  string
>({
  key: 'rawTransaction',
  get:
    (signature) =>
    async ({ get }) => {
      const { endpoint } = get(solanaCluster)
      const connection = new Connection(endpoint)

      return await connection.getTransaction(signature)
    },
})

export const useRawTransaction = (signature: string) =>
  useRecoilValue(fetchRawTransactionSelector(signature))

export interface Details {
  transaction: Transaction
  message: Message
  signatures: string[]
}

export const fetchRawPopulatedTransactionSelector = selectorFamily<
  Details | null,
  string
>({
  key: 'rawPopulatedTransaction',
  get:
    (signature) =>
    async ({ get }) => {
      const { endpoint } = get(solanaCluster)
      const connection = new Connection(endpoint)

      const response = await connection.getTransaction(signature)

      if (!response) {
        return null
      }

      const {
        transaction: { message, signatures },
      } = response

      return {
        message,
        signatures,
        transaction: Transaction.populate(message, signatures),
      }
    },
})

export const useRawPopulatedTransaction = (signature: string) =>
  useRecoilValue(fetchRawPopulatedTransactionSelector(signature))

export const fetchParsedConfirmedTransactionSelector = selectorFamily<
  ParsedConfirmedTransaction | null,
  string
>({
  key: 'parsedConfirmedTransaction',
  get:
    (signature) =>
    async ({ get }) => {
      const { endpoint } = get(solanaCluster)
      return await fetchParsedConfirmedTransaction(endpoint, signature)
    },
})

export const useParsedConfirmedTransaction = (signature: string) =>
  useRecoilValue(fetchParsedConfirmedTransactionSelector(signature))
