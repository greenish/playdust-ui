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
  any
>({
  key: 'accountInfo',
  get:
    (pubkey) =>
    async ({ get }) => {
      get(pageIdx) // bust this cache every page

      const { endpoint } = get(solanaCluster)

      const connection = new Connection(endpoint, 'confirmed')

      const { value } = await connection.getParsedAccountInfo(pubkey)

      return value
    },
})

export const useAccountInfo = (pubkey: PublicKey) =>
  useRecoilValue(fetchAccountInfo(pubkey))
