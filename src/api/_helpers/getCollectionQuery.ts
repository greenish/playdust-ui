import type ComposedQueryType from '../../_types/ComposedQueryType'
import type QueryNodeType from '../../_types/QueryNodeType'

const createSingleCollectionQuery = (entry: QueryNodeType) => {
  return {
    multi_match: {
      query: entry.value,
      fields: ['name^2', 'symbol^2', 'description'],
      fuzziness: 'AUTO',
    },
  }
}

const createOrQuery = (entries: QueryNodeType[]) => ({
  bool: {
    should: entries.map((entry) => createSingleCollectionQuery(entry)),
  },
})

const createCollectionQuery = (query: ComposedQueryType) => {
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
    _source: {
      exclude: ['attributes'],
    },
    query: {
      bool: {
        must: result,
      },
    },
    sort: [
      {
        totalVolume: {
          order: 'desc',
        },
      },
    ],
  }

  return composedQuery
}

const getCollectionQuery = (query: ComposedQueryType) => {
  const freeTextSearches = query
    .map((parent) => parent.filter((child) => child.field === 'text'))
    .filter((parent) => parent.length)

  if (!freeTextSearches.length) {
    return undefined
  }

  const collectionQuery = createCollectionQuery(freeTextSearches) as object

  return collectionQuery
}

export default getCollectionQuery
