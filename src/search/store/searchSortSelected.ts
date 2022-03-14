import { selector } from 'recoil'
import * as store from './'

export const searchSortSelected = selector<store.SearchSortOption>({
  key: 'searchSortSelected',
  get: ({ get }) => {
    const options = get(store.searchSortVisibleOptions)
    const result = options.find((entry) => entry.selected) || options[0]

    return result
  },
})
