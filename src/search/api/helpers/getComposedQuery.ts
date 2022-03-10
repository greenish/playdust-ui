import { SearchSort } from '../../store'
import ComposedQueryType, { QueryType } from '../../types/ComposedQueryType'
import createSingleQuery from './createSingleQuery'

const createOrQuery = (entries: QueryType[]) => ({
  bool: {
    should: entries.map((entry) => createSingleQuery(entry)),
  },
})

const sortMappings: {
  [key: string]: string
} = {
  name: 'offChainData.name.keyword',
}

const getComposedQuery = (
  query: ComposedQueryType,
  resultSize: number,
  sort?: SearchSort
) => {
  const result = query
    .map((parent) => {
      if (parent.length === 1) {
        const firstChild = parent[0]
        return createSingleQuery(firstChild)
      }

      return createOrQuery(parent)
    })
    .filter(Boolean)

  const composedQuery: any = {
    size: resultSize === undefined ? 25 : resultSize,
    query: {
      bool: {
        // TODO remove once there is a soluton on backend
        must_not: [
          {
            term: {
              'data.name.keyword': '',
            },
          },
          {
            term: {
              'data.name.keyword': ' ',
            },
          },
          {
            term: {
              'data.name.keyword': '  ',
            },
          },
          {
            term: {
              'data.name.keyword': '   ',
            },
          },
          {
            term: {
              'data.name.keyword': '    ',
            },
          },
          {
            term: {
              'data.name.keyword': '     ',
            },
          },
        ],
        filter: result,
      },
    },
  }

  const sortMapping = sort && sortMappings[sort.field]
  if (sortMapping) {
    composedQuery.sort = [
      {
        [sortMapping]: sort.direction,
      },
    ]
  }

  return composedQuery
}

export default getComposedQuery
