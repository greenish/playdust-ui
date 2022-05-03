import { Connection } from '@solana/web3.js'
import { selectorFamily } from 'recoil'
import * as solana from '../../../solana'
import solanaCluster from '../../App/_atoms/solanaCluster'
import type { SearchMetadataOnChain } from '../../App/_types/SearchMetadataType'

export const fetchOwnedOnchain = selectorFamily<SearchMetadataOnChain[], any>({
  key: 'fetchOwnedOnchain',
  get: (publicKey) => {
    return async ({ get }) => {
      const { endpoint } = get(solanaCluster)
      const connection = new Connection(endpoint)
      const result = await solana.fetchOnchain.byOwner(connection, publicKey)

      return result
    }
  },
})
