import { selector } from 'recoil'
import { searchSort } from './searchSort'

export const searchSortSelected = selector({
  key: 'searchSortSelected',
  get: ({ get }) => {
    const sort = get(searchSort)

    return sort.options[sort.selectedIndex]
  },
})
