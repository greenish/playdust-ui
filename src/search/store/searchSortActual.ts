import { selector } from 'recoil'
import * as store from './'

export const searchSortActual = selector<store.SearchSortOption>({
  key: 'searchSortActual',
  get: ({ get }) => {
    const selected = get(store.searchSortSelected)

    if (selected) {
      return selected
    }

    return get(store.searchSortVisibleOptions)[0]
  },
})
