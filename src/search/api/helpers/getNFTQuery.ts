import { SearchSort } from '../../store'
import ComposedQueryType, { QueryType } from '../../types/ComposedQueryType'
import createSingleNFTQuery from './createSingleNFTQuery'

const createOrQuery = (entries: QueryType[]) => ({
  bool: {
    should: entries.map((entry) => createSingleNFTQuery(entry)),
  },
})

const sortMappings: {
  [key: string]: string
} = {
  name: 'offChainData.name.keyword',
}

const getNFTQuery = (
  query: ComposedQueryType,
  resultSize: number,
  sort?: SearchSort
) => {
  const result = query
    .map((parent) => {
      if (parent.length === 1) {
        const firstChild = parent[0]
        return createSingleNFTQuery(firstChild)
      }

      return createOrQuery(parent)
    })
    .filter(Boolean)

  const baseQuery = {
    filter: result,
  }

  const nftQuery: any = {
    size: resultSize === undefined ? 25 : resultSize,
    query: {
      bool:
        query.length === 0
          ? {
              // TODO remove once there is a soluton on index to check for empty strings
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
              ...baseQuery,
            }
          : baseQuery,
    },
  }

  const sortMapping = sort && sortMappings[sort.field]
  if (sortMapping) {
    nftQuery.sort = [
      {
        [sortMapping]: sort.direction,
      },
    ]
  }

  return nftQuery
}

export default getNFTQuery
