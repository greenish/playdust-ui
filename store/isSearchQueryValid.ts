import { selector } from 'recoil'
import { QueryType } from '../types/ComposedQueryType'
import searchQuery from './searchQuery'

export const queryValidationPredicate = (entry: QueryType) => {
  if ('trait' in entry && entry.trait === '') {
    return false
  }

  const { value } = entry

  if (value === '') {
    return false
  }

  if (Array.isArray(value) && value.length === 0) {
    return false
  }

  return true
}

const isSearchQueryValid = selector<boolean>({
  key: 'isSearchQueryValid',
  get: ({ get }) => {
    const flattened = get(searchQuery).flat()

    const result = flattened.every(queryValidationPredicate)

    return result
  },
})

export default isSearchQueryValid
