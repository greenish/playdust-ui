import { Connection } from '@solana/web3.js'
import { selectorFamily } from 'recoil'
import * as solana from '../solana'
import type { SearchMetadataOnChain } from '../types/SearchMetadata'
import solanaCluster from './solanaCluster'

const fetchOwnedOnchain = selectorFamily<SearchMetadataOnChain[], any>({
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

export default fetchOwnedOnchain
