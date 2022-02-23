import { selector } from 'recoil'
import type { ExactAttributeQuery, QueryType } from '../types/ComposedQueryType'
import searchQuery from './searchQuery'

const isExactAttributeQuery = (
  query: QueryType
): query is ExactAttributeQuery =>
  'trait' in query &&
  query.field === 'attribute' &&
  query.searchType === 'exact'

const searchQueryExactAttributes = selector<ExactAttributeQuery[]>({
  key: 'searchQueryExactAttributes',
  get: ({ get }) => {
    const query = get(searchQuery)

    const result = query.flat().filter(isExactAttributeQuery)

    return result
  },
})

export default searchQueryExactAttributes