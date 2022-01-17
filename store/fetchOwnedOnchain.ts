import {
  selectorFamily,
  waitForNone,
} from 'recoil'
import type {
  ParsedMetadata
} from '../solana/types'
import * as solana from '../solana'
import fetchOffchain from './fetchOffchain'

const fetchOwnedOnchain = selectorFamily<ParsedMetadata[], any>({
  key: 'fetchCollectionOnchain',
  get: publicKey =>
    async ({ get }) => {
      const result = await solana.fetchOnchain.byOwner(publicKey)

      const offchainData = get(waitForNone(
        result.map(entry => fetchOffchain(entry.onchain.data.uri))
      ))

      return result.map((entry, idx) => {
        if (offchainData[idx].state === 'hasValue') {
          return {
            ...entry,
            offchain: offchainData[idx].contents,
          }
        }

        return {
          ...entry,
          offchain: {},
        }
      })
    },
})

export default fetchOwnedOnchain