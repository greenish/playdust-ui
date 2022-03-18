import { selector } from 'recoil'
import * as store from '.'

export const isCollectionQuery = selector<boolean>({
  key: 'isCollectionQuery',
  get: ({ get }) => {
    const queryValid = get(store.searchQueryNoRanges)
    const firstParent = queryValid[0]

    return firstParent?.length === 1 && firstParent[0].field === 'collection'
  },
})
