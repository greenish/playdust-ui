import {
  ConfirmedSignatureInfo,
  Connection,
  PublicKey,
  TransactionResponse,
} from '@solana/web3.js'
import { selectorFamily, useRecoilValue, waitForAll } from 'recoil'
import { fetchSignaturesForAddress } from './fetchSignaturesForAddress'
import { fetchTransaction } from './fetchTransaction'
import solanaCluster from './solanaCluster'

export const fetchAccountHistory = selectorFamily<
  {
    signatures: ConfirmedSignatureInfo[]
    transactions: (TransactionResponse | null)[]
  },
  string
>({
  key: 'accountHistory',
  get:
    (accountId) =>
    async ({ get }) => {
      const pubkey = new PublicKey(accountId)

      const { endpoint } = get(solanaCluster)
      const connection = new Connection(endpoint)

      const signatures = get(fetchSignaturesForAddress(pubkey))

      const transactions = get(
        waitForAll(
          signatures.map((signature) => {
            return fetchTransaction(signature.signature)
          })
        )
      )

      return {
        signatures,
        transactions,
      }
    },
})

export const useAccountHistory = (accountId: string) =>
  useRecoilValue(fetchAccountHistory(accountId))
