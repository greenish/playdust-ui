import {
  Connection,
  Message,
  ParsedConfirmedTransaction,
  Transaction,
  TransactionResponse,
} from '@solana/web3.js'
import { selectorFamily, useRecoilValue } from 'recoil'
import { solanaCluster } from '../../app/store'

export const fetchRawTransaction = selectorFamily<
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
  useRecoilValue(fetchRawTransaction(signature))

export interface Details {
  transaction: Transaction
  message: Message
  signatures: string[]
}

export const fetchRawPopulatedTransaction = selectorFamily<
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
  useRecoilValue(fetchRawPopulatedTransaction(signature))

export const fetchParsedConfirmedTransaction = selectorFamily<
  ParsedConfirmedTransaction | null,
  string
>({
  key: 'parsedConfirmedTransaction',
  get:
    (signature) =>
    async ({ get }) => {
      const { endpoint } = get(solanaCluster)
      const connection = new Connection(endpoint)

      return await connection.getParsedConfirmedTransaction(signature)
    },
})

export const useParsedConfirmedTransaction = (signature: string) =>
  useRecoilValue(fetchParsedConfirmedTransaction(signature))
