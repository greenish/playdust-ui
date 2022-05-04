import {
  ConfirmedSignatureInfo,
  ParsedConfirmedTransaction,
  PublicKey,
  TransactionResponse,
} from '@solana/web3.js'
import { selectorFamily, useRecoilValue, waitForAll } from 'recoil'
import { fetchSignaturesForAddressSelector } from './fetchSignaturesForAddress'
import {
  fetchParsedConfirmedTransactionSelector,
  fetchRawTransactionSelector,
} from './fetchTransaction'

export interface SignaturesAndTransactions {
  signatures: ConfirmedSignatureInfo[]
  transactions: (TransactionResponse | null)[]
}

export interface SignaturesAndParsedTransactions {
  signatures: ConfirmedSignatureInfo[]
  transactions: (ParsedConfirmedTransaction | null)[]
}

export const fetchRawAccountHistorySelector = selectorFamily<
  SignaturesAndTransactions,
  any
>({
  key: 'rawAccountHistory',
  get:
    (pubkey) =>
    async ({ get }) => {
      const signatures = get(fetchSignaturesForAddressSelector(pubkey))

      const transactions = get(
        waitForAll(
          signatures.map((signature) => {
            return fetchRawTransactionSelector(signature.signature)
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
  useRecoilValue(fetchRawAccountHistorySelector(pubkey))

export const fetchAccountHistorySelector = selectorFamily<
  SignaturesAndParsedTransactions,
  any
>({
  key: 'accountHistory',
  get:
    (pubkey) =>
    async ({ get }) => {
      const signatures = get(fetchSignaturesForAddressSelector(pubkey))

      const transactions = get(
        waitForAll(
          signatures.map((signature) => {
            return fetchParsedConfirmedTransactionSelector(signature.signature)
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
  useRecoilValue(fetchAccountHistorySelector(pubkey))

export const fetchRawAccountHistoriesSelector = selectorFamily<
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
            return fetchRawAccountHistorySelector(pubkey)
          })
        )
      )

      return allSignaturesAndTransactions
    },
})

export const useRawAccountHistories = (pubkeys: PublicKey[]) =>
  useRecoilValue(fetchRawAccountHistoriesSelector(pubkeys))

export const fetchAccountHistoriesSelector = selectorFamily<
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
            return fetchAccountHistorySelector(pubkey)
          })
        )
      )

      return allSignaturesAndTransactions
    },
})

export const useAccountHistories = (pubkeys: PublicKey[]) =>
  useRecoilValue(fetchAccountHistoriesSelector(pubkeys))
