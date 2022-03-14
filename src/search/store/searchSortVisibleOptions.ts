import { selector } from 'recoil'
import * as store from './'

export const searchSortVisibleOptions = selector<store.SearchSortOption[]>({
  key: 'searchSortVisibleOptions',
  get: ({ get }) => {
    const all = get(store.searchSortOptions)
    const isTextQuery = get(store.isTextQuery)

    if (isTextQuery) {
      return all
    }

    return all.filter((option) => option.value.field !== 'relevance')
  },
})
