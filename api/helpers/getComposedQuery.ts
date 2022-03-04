import ComposedQueryType, { QueryType } from '../../types/ComposedQueryType'
import createSingleQuery from './createSingleQuery'

const createOrQuery = (entries: QueryType[]) => ({
  bool: {
    should: entries.map((entry) => createSingleQuery(entry)),
  },
})

const getComposedQuery = (
  query: ComposedQueryType,
  resultSize: number,
  sortAttribute: Object = {}
) => {
  const result = query.map((parent) => {
    if (parent.length === 1) {
      const firstChild = parent[0]
      return createSingleQuery(firstChild)
    }

    return createOrQuery(parent)
  })

  const composedQuery: any = {
    size: resultSize === undefined ? 25 : resultSize,
    query: {
      bool: {
        filter: result,
      },
    },
  }

  if (Object.keys(sortAttribute).length) {
    composedQuery.sort = [sortAttribute]
  }

  return composedQuery
}

export default getComposedQuery
