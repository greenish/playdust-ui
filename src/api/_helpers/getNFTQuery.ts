import type ComposedQueryType from '../../_types/ComposedQueryType'
import type QueryNodeType from '../../_types/QueryNodeType'
import type SearchSortType from '../../_types/SearchSortType'
import createSingleNFTQuery from './createSingleNFTQuery'

const createOrQuery = (entries: QueryNodeType[]) => ({
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

const getNFTQueryBase = (query: ComposedQueryType, onlyListed: boolean) => {
  const result = query
    .map((parent) => {
      if (parent.length === 1) {
        const firstChild = parent[0]
        return createSingleNFTQuery(firstChild)
      }

      return createOrQuery(parent)
    })
    .filter(Boolean)

  return onlyListed
    ? [
        ...result,
        {
          term: {
            listed: true,
          },
        },
      ]
    : result
}

const getNFTQuery = (
  query: ComposedQueryType,
  resultSize: number,
  sort?: SearchSortType,
  onlyListed?: boolean
) => {
  const queryBase = getNFTQueryBase(query, Boolean(onlyListed))

  const isRelevanceSort = sort?.field === 'relevance'
  const filterKey = isRelevanceSort ? 'must' : 'filter'
  const baseQuery = {
    [filterKey]: queryBase,
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
