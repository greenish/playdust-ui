import { Connection, PublicKey, StakeActivationData } from '@solana/web3.js'
import { selectorFamily, useRecoilValue } from 'recoil'
import solanaCluster from '../../../store/solanaCluster'
import { pageIdx } from './pageIdx'

export const fetchStakeActivation = selectorFamily<StakeActivationData, any>({
  key: 'stakeActivation',
  get:
    (pubkey) =>
    async ({ get }) => {
      get(pageIdx) // bust this cache every page

      const { endpoint } = get(solanaCluster)

      const connection = new Connection(endpoint, 'confirmed')

      return await connection.getStakeActivation(pubkey)
    },
})

export const useStakeActivation = (pubkey: PublicKey) =>
  useRecoilValue(fetchStakeActivation(pubkey))
