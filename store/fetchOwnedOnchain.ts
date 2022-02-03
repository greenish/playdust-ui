import { Connection } from '@solana/web3.js'
import { selectorFamily } from 'recoil'
import * as solana from '../solana'
import type { ParsedOnchain } from '../solana/types'
import solanaCluster from './solanaCluster'

const fetchOwnedOnchain = selectorFamily<ParsedOnchain[], any>({
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
