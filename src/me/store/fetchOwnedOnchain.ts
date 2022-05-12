import { Connection } from '@solana/web3.js'
import { selectorFamily } from 'recoil'
import * as solana from '../../../solana'
import solanaClusterAtom from '../../App/_atoms/solanaClusterAtom'
import type { SearchMetadataOnChain } from '../../../solana/SearchMetadataType'

export const fetchOwnedOnchain = selectorFamily<SearchMetadataOnChain[], any>({
  key: 'fetchOwnedOnchain',
  get: (publicKey) => {
    return async ({ get }) => {
      const { endpoint } = get(solanaClusterAtom)
      const connection = new Connection(endpoint)
      const result = await solana.fetchOnchain.byOwner(connection, publicKey)

      return result
    }
  },
})
