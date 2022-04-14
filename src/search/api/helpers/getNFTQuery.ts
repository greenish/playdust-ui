import ComposedQueryType, { QueryType } from '../../types/ComposedQueryType'
import type SearchSort from '../../types/SearchSort'
import createSingleNFTQuery from './createSingleNFTQuery'

const createOrQuery = (entries: QueryType[]) => ({
  bool: {
    should: entries.map((entry) => createSingleNFTQuery(entry)),
  },
})

const sortMappings: {
  [key: string]: string
} = {
  name: 'offChainData.name.sort',
  'list-price': 'lastListPrice',
  'sale-price': 'lastTradePrice',
  'rarity-score': 'normalizedRarityScore',
}

const getNFTQuery = (
  query: ComposedQueryType,
  resultSize: number,
  sort?: SearchSort,
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

  const isRelevanceSort = sort?.field === 'relevance'
  const filterKey = isRelevanceSort ? 'must' : 'filter'
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

  if (isRelevanceSort) {
    nftQuery.sort = [
      '_score',
      {
        [sortMappings.name]: 'asc',
      },
    ]
  }

  return nftQuery
}

export default getNFTQuery
