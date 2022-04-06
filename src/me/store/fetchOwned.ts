import { selectorFamily, waitForNone } from 'recoil'
import type SearchMetadata from '../../common/types/SearchMetadata'
import * as store from './'

export const fetchOwned = selectorFamily<SearchMetadata[], any>({
  key: 'fetchOwned',
  get: (publicKey) => {
    return async ({ get }) => {
      const result = get(store.fetchOwnedOnchain(publicKey))

      const offchainData = get(
        waitForNone(result.map((entry) => store.fetchOffchain(entry.data.uri)))
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
