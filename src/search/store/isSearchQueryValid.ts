import { selector } from 'recoil'
import { QueryType } from '../types/ComposedQueryType'
import { searchQuery } from './'

export const queryValidationPredicate = (entry: QueryType) => {
  if (entry.field === 'attribute') {
    return entry.value.length > 0 || entry.trait !== ''
  }

  if (entry.value === '') {
    return false
  }
  return true
}

export const isSearchQueryValid = selector<boolean>({
  key: 'isSearchQueryValid',
  get: ({ get }) => {
    const flattened = get(searchQuery).flat()

    const result = flattened.every(queryValidationPredicate)

    return result
  },
})
