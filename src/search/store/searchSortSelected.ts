import { selector } from 'recoil'
import * as store from './'

export const searchSortSelected = selector<store.SearchSortOption | undefined>({
  key: 'searchSortSelected',
  get: ({ get }) => {
    const options = get(store.searchSortVisibleOptions)
    const result = options.find((entry) => entry.selected)

    return result
  },
})
