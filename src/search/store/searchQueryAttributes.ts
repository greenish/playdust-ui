import { selector } from 'recoil'
import type { AttributeQuery, QueryType } from '../types/ComposedQueryType'
import { searchQuery } from './'

const isExactAttributeQuery = (query: QueryType): query is AttributeQuery =>
  'trait' in query && query.field === 'attribute'

export const searchQueryAttributes = selector<AttributeQuery[]>({
  key: 'searchQueryAttributes',
  get: ({ get }) => {
    const query = get(searchQuery)

    const result = query.flat().filter(isExactAttributeQuery)

    return result
  },
})
