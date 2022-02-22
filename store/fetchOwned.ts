import { selectorFamily, waitForNone } from 'recoil'
import type SearchMetadata from '../types/SearchMetadata'
import fetchOffchain from './fetchOffchain'
import fetchOwnedOnchain from './fetchOwnedOnchain'

const fetchOwned = selectorFamily<SearchMetadata[], any>({
  key: 'fetchOwned',
  get: (publicKey) => {
    return async ({ get }) => {
      const result = get(fetchOwnedOnchain(publicKey))

      const offchainData = get(
        waitForNone(result.map((entry) => fetchOffchain(entry.data.uri)))
      )

      return result.map((entry, idx) => {
        if (offchainData[idx].state === 'hasValue') {
          return {
            ...entry,
            offChainData: offchainData[idx].contents,
          }
        }

        return {
          ...entry,
          offChainData: {},
        }
      })
    }
  },
})

export default fetchOwned
