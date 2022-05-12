import {
  AccountInfo,
  Connection,
  ParsedAccountData,
  PublicKey,
} from '@solana/web3.js'
import { Buffer } from 'buffer'
import { selectorFamily, useRecoilValue } from 'recoil'
import solanaClusterAtom from '../../App/_atoms/solanaClusterAtom'
import type SolanaClusterType from '../../_types/SolanaClusterType'
import { pageIdx } from './pageIdx'

export const fetchAccountInfo = async (
  solanaCluster: SolanaClusterType,
  pubkey: PublicKey
) => {
  if (!solanaCluster || !pubkey) {
    return null
  }

  const { endpoint } = solanaCluster

  const connection = new Connection(endpoint, 'confirmed')

  const { value } = await connection.getParsedAccountInfo(pubkey)

  return value
}

export const fetchAccountInfoSelectorFamily = selectorFamily<
  AccountInfo<Buffer | ParsedAccountData> | null,
  any
>({
  key: 'accountInfo',
  get:
    (pubkey) =>
    async ({ get }) => {
      get(pageIdx) // bust this cache every page

      const solanaCluster = get(solanaClusterAtom)

      return fetchAccountInfo(solanaCluster, pubkey)
    },
})

export const useAccountInfo = (pubkey: PublicKey | undefined) =>
  useRecoilValue(fetchAccountInfoSelectorFamily(pubkey))
