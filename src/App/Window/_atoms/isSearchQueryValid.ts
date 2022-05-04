import { selector } from 'recoil'
import queryValidationPredicate from '../_helpers/queryValidationPredicate'
import searchStateUncommitted from './searchStateUncommitted'

const isSearchQueryValid = selector<boolean>({
  key: 'isSearchQueryValid',
  get: ({ get }) => {
    const flattened = get(searchStateUncommitted).query.flat()

    const result = flattened.every(queryValidationPredicate)

    return result
  },
})

export default isSearchQueryValid
