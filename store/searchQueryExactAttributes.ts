import { selector } from 'recoil'
import searchQuery, { ExactAttributeQuery, QueryType } from './searchQuery'

const isExactAttributeQuery = (
  query: QueryType
): query is ExactAttributeQuery => true

const searchQueryExactAttributes = selector<ExactAttributeQuery[]>({
  key: 'searchQueryExactAttributes',
  get: ({ get }) => {
    const query = get(searchQuery)

    const result = query.flat().filter(isExactAttributeQuery)

    return result
  },
})

export default searchQueryExactAttributes
