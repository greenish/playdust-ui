import ComposedQueryType, { QueryType } from '../../types/ComposedQueryType'

const createSingleCollectionQuery = (entry: QueryType) => {
  return {
    multi_match: {
      query: entry.value,
      fields: ['name^2', 'symbol^2', 'description'],
      fuzziness: 'AUTO',
    },
  }
}

const createOrQuery = (entries: QueryType[]) => ({
  bool: {
    should: entries.map((entry) => createSingleCollectionQuery(entry)),
  },
})

const getNFTQuery = (query: ComposedQueryType) => {
  const result = query
    .map((parent) => {
      if (parent.length === 1) {
        const firstChild = parent[0]
        return createSingleCollectionQuery(firstChild)
      }

      return createOrQuery(parent)
    })
    .filter(Boolean)

  const composedQuery = {
    size: 10,
    query: {
      bool: {
        must: result,
      },
    },
  }

  return composedQuery
}

export default getNFTQuery
