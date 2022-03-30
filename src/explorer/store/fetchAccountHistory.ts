import {
  ConfirmedSignatureInfo,
  ParsedConfirmedTransaction,
  PublicKey,
  TransactionResponse,
} from '@solana/web3.js'
import { selectorFamily, useRecoilValue, waitForAll } from 'recoil'
import { fetchSignaturesForAddress } from './fetchSignaturesForAddress'
import {
  fetchParsedConfirmedTransaction,
  fetchRawTransaction,
} from './fetchTransaction'

export interface SignaturesAndTransactions {
  signatures: ConfirmedSignatureInfo[]
  transactions: (TransactionResponse | null)[]
}

export interface SignaturesAndParsedTransactions {
  signatures: ConfirmedSignatureInfo[]
  transactions: (ParsedConfirmedTransaction | null)[]
}

export const fetchRawAccountHistory = selectorFamily<
  SignaturesAndTransactions,
  any
>({
  key: 'rawAccountHistory',
  get:
    (pubkey) =>
    async ({ get }) => {
      const signatures = get(fetchSignaturesForAddress(pubkey))

      const transactions = get(
        waitForAll(
          signatures.map((signature) => {
            return fetchRawTransaction(signature.signature)
          })
        )
      )

      return {
        signatures,
        transactions,
      }
    },
})

export const useRawAccountHistory = (pubkey: PublicKey) =>
  useRecoilValue(fetchRawAccountHistory(pubkey))

export const fetchAccountHistory = selectorFamily<
  SignaturesAndParsedTransactions,
  any
>({
  key: 'accountHistory',
  get:
    (pubkey) =>
    async ({ get }) => {
      const signatures = get(fetchSignaturesForAddress(pubkey))

      const transactions = get(
        waitForAll(
          signatures.map((signature) => {
            return fetchParsedConfirmedTransaction(signature.signature)
          })
        )
      )

      return {
        signatures,
        transactions,
      }
    },
})

export const useAccountHistory = (pubkey: PublicKey) =>
  useRecoilValue(fetchAccountHistory(pubkey))

export const fetchRawAccountHistories = selectorFamily<
  SignaturesAndTransactions[],
  any[]
>({
  key: 'rawAccountHistories',
  get:
    (pubkeys) =>
    async ({ get }) => {
      const allSignaturesAndTransactions = get(
        waitForAll(
          pubkeys.map((pubkey: PublicKey) => {
            return fetchRawAccountHistory(pubkey)
          })
        )
      )

      return allSignaturesAndTransactions
    },
})

export const useRawAccountHistories = (pubkeys: PublicKey[]) =>
  useRecoilValue(fetchRawAccountHistories(pubkeys))

export const fetchAccountHistories = selectorFamily<
  SignaturesAndParsedTransactions[],
  any[]
>({
  key: 'accountHistories',
  get:
    (pubkeys) =>
    async ({ get }) => {
      const allSignaturesAndTransactions = get(
        waitForAll(
          pubkeys.map((pubkey: PublicKey) => {
            return fetchAccountHistory(pubkey)
          })
        )
      )

      return allSignaturesAndTransactions
    },
})

export const useAccountHistories = (pubkeys: PublicKey[]) =>
  useRecoilValue(fetchAccountHistories(pubkeys))
