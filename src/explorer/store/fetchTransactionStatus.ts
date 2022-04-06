import {
  Connection,
  SignatureResult,
  SignatureStatus,
  TransactionConfirmationStatus,
  TransactionSignature,
} from '@solana/web3.js'
import { selectorFamily, useRecoilValue } from 'recoil'
import { solanaCluster } from '../../app/store'

export type Confirmations = number | 'max'

export type Timestamp = number | 'unavailable'

export interface TransactionStatusInfo {
  slot: number
  result: SignatureResult
  timestamp: Timestamp
  confirmations: Confirmations
  confirmationStatus?: TransactionConfirmationStatus
}

export interface TransactionStatus {
  signature: TransactionSignature
  info: TransactionStatusInfo | null
}

export async function fetchTransactionStatus(
  endpoint: string,
  signature: TransactionSignature
) {
  try {
    const connection = new Connection(endpoint)

    const { value } = await connection.getSignatureStatus(signature, {
      searchTransactionHistory: true,
    })

    let info = null
    if (value !== null) {
      let confirmations: Confirmations
      if (typeof value.confirmations === 'number') {
        confirmations = value.confirmations
      } else {
        confirmations = 'max'
      }

      let blockTime = null
      try {
        blockTime = await connection.getBlockTime(value.slot)
      } catch (error) {}
      let timestamp: Timestamp = blockTime !== null ? blockTime : 'unavailable'

      info = {
        slot: value.slot,
        timestamp,
        confirmations,
        confirmationStatus: value.confirmationStatus,
        result: { err: value.err },
      }
    }

    return { signature, info }
  } catch (error) {}

  return null
}

export const fetchTransactionStatusSelector = selectorFamily<
  TransactionStatus | null,
  string
>({
  key: 'transactionStatus',
  get:
    (signature) =>
    async ({ get }) => {
      const { endpoint } = get(solanaCluster)

      return fetchTransactionStatus(endpoint, signature)
    },
})

export const useTransactionStatus = (signature: string) =>
  useRecoilValue(fetchTransactionStatusSelector(signature))

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
