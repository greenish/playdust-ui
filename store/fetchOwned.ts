import { selectorFamily, waitForNone } from 'recoil'
import type { ParsedMetadata } from '../solana/types'
import fetchOffchain from './fetchOffchain'
import fetchOwnedOnchain from './fetchOwnedOnchain'

const fetchOwned = selectorFamily<ParsedMetadata[], any>({
  key: 'fetchOwned',
  get: (publicKey) => {
    return async ({ get }) => {
      const result = get(fetchOwnedOnchain(publicKey))

      const offchainData = get(
        waitForNone(
          result.map((entry) => fetchOffchain(entry.onchain.data.uri))
        )
      )

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
    }
  },
})

export default fetchOwned
