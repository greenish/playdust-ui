import {
  AccountInfo,
  Connection,
  ParsedAccountData,
  PublicKey,
} from '@solana/web3.js'
import { Buffer } from 'buffer'
import { selectorFamily, useRecoilValue } from 'recoil'
import { pageIdx } from './pageIdx'
import solanaCluster from './solanaCluster'

export const fetchAccountInfo = selectorFamily<
  AccountInfo<Buffer | ParsedAccountData> | null,
  string
>({
  key: 'accountInfo',
  get:
    (accountId) =>
    async ({ get }) => {
      get(pageIdx) // bust this cache every page

      const pubkey = new PublicKey(accountId)

      const { endpoint } = get(solanaCluster)

      const connection = new Connection(endpoint)

      const { value } = await connection.getParsedAccountInfo(pubkey)

      return value
    },
})

export const useAccountInfo = (accountId: string) =>
  useRecoilValue(fetchAccountInfo(accountId))
