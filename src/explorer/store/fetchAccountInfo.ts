import {
  AccountInfo,
  Connection,
  ParsedAccountData,
  PublicKey,
} from '@solana/web3.js'
import { Buffer } from 'buffer'
import { selectorFamily, useRecoilValue } from 'recoil'
import solanaCluster from '../../../store/solanaCluster'
import { pageIdx } from './pageIdx'

export const fetchAccountInfo = selectorFamily<
  AccountInfo<Buffer | ParsedAccountData> | null,
  any
>({
  key: 'accountInfo',
  get:
    (pubkey) =>
    async ({ get }) => {
      if (!pubkey) {
        return null
      }

      get(pageIdx) // bust this cache every page

      const { endpoint } = get(solanaCluster)

      const connection = new Connection(endpoint, 'confirmed')

      const { value } = await connection.getParsedAccountInfo(pubkey)

      return value
    },
})

export const useAccountInfo = (pubkey: PublicKey | undefined) =>
  useRecoilValue(fetchAccountInfo(pubkey))
