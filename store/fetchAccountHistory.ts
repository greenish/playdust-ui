import {
  ConfirmedSignatureInfo,
  Connection,
  PublicKey,
  TransactionResponse,
} from '@solana/web3.js'
import { selectorFamily, useRecoilValue, waitForAll } from 'recoil'
import { fetchSignaturesForAddress } from './fetchSignaturesForAddress'
import { fetchRawTransaction } from './fetchTransaction'
import solanaCluster from './solanaCluster'

export interface SignaturesAndTransactions {
  signatures: ConfirmedSignatureInfo[]
  transactions: (TransactionResponse | null)[]
}

export const fetchAccountHistory = selectorFamily<
  SignaturesAndTransactions,
  any
>({
  key: 'accountHistory',
  get:
    (pubkey) =>
    async ({ get }) => {
      const { endpoint } = get(solanaCluster)
      const connection = new Connection(endpoint)

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

export const useAccountHistory = (pubkey: PublicKey) =>
  useRecoilValue(fetchAccountHistory(pubkey))

export const fetchAccountHistories = selectorFamily<
  SignaturesAndTransactions[],
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
