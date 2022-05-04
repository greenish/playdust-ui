import { selector } from 'recoil'
import queryValidationPredicate from '../_helpers/queryValidationPredicate'
import searchStateUncommitted from './searchStateUncommitted'

const searchQueryValid = selector({
  key: 'searchQueryValid',
  get: ({ get }) => {
    const { query } = get(searchStateUncommitted)
    const result = query
      .map((parent) => parent.filter(queryValidationPredicate))
      .filter((entry) => entry.length > 0)

    return result
  },
})

export default searchQueryValid
