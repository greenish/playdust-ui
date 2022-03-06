import {
  Connection,
  ParsedConfirmedTransaction,
  SignatureStatus,
  TransactionResponse,
} from '@solana/web3.js'
import { selectorFamily, useRecoilValue } from 'recoil'
import solanaCluster from './solanaCluster'

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

export const fetchSignatureStatus = selectorFamily<
  SignatureStatus | null,
  string
>({
  key: 'signatureStatus',
  get:
    (signature) =>
    async ({ get }) => {
      const { endpoint } = get(solanaCluster)
      const connection = new Connection(endpoint)

      const { value } = await connection.getSignatureStatus(signature, {
        searchTransactionHistory: true,
      })

      return value
    },
})

export const useSignatureStatus = (signature: string) =>
  useRecoilValue(fetchSignatureStatus(signature))
