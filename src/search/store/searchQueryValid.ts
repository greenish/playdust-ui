import { selector } from 'recoil'
import { searchQuery } from './'
import { queryValidationPredicate } from './isSearchQueryValid'

export const searchQueryValid = selector({
  key: 'searchQueryValid',
  get: ({ get }) => {
    const query = get(searchQuery)
    const result = query
      .map((parent) => parent.filter(queryValidationPredicate))
      .filter((entry) => entry.length > 0)

    return result
  },
})
