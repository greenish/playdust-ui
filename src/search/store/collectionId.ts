import { selector } from 'recoil'
import * as store from './'

export const collectionId = selector({
  key: 'collectionId',
  get: ({ get }) => {
    const isCollectionQuery = get(store.isCollectionQuery)

    if (!isCollectionQuery) {
      return undefined
    }
    const query = get(store.searchQueryNoRanges)

    return query[0][0].value as string
  },
})
