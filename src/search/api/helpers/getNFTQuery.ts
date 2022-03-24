import { SearchSortValue } from '../../store'
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
  'list-price': 'lastListPrice',
  'sale-price': 'lastTradePrice',
}

const getNFTQuery = (
  query: ComposedQueryType,
  resultSize: number,
  sort?: SearchSortValue,
  onlyListed?: boolean
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

  const filterKey = sort?.field === 'relevance' ? 'must' : 'filter'
  const baseQuery = {
    [filterKey]: onlyListed
      ? [
          ...result,
          {
            term: {
              listed: true,
            },
          },
        ]
      : result,
  }

  const nftQuery: { [key: string]: any } = {
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
