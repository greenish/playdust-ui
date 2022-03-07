import { selector } from 'recoil'
import { queryValidationPredicate } from './isSearchQueryValid'
import searchQuery from './searchQuery'

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

export default searchQueryValid
