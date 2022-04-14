import { SearchFilterFields } from '../../store'
import {
  AttributeQuery,
  CollectionQuery,
  QueryType,
  TextQuery,
} from '../../types/ComposedQueryType'

const getRangeField = (field: SearchFilterFields) => {
  switch (field) {
    case 'list-price':
      return 'lastListPrice'
    case 'sale-price':
      return 'lastTradePrice'
    case 'rarity-score':
      return 'normalizedRarityScore'
    default:
      const n: never = field

      return n
  }
}

const createSingleNFTQuery = (child: QueryType) => {
  switch (child.field) {
    case 'attribute': {
      const { trait, value } = child as AttributeQuery

      return {
        nested: {
          path: 'offChainData.attributes',
          query: {
            bool: {
              must: [
                trait !== '' && {
                  match: {
                    'offChainData.attributes.trait_type.keyword': trait,
                  },
                },
                value &&
                  value.length > 0 && {
                    bool: {
                      should: value.map((entry) => ({
                        match: {
                          'offChainData.attributes.value.keyword': entry,
                        },
                      })),
                    },
                  },
              ].filter(Boolean),
            },
          },
        },
      }
    }
    case 'collection': {
      const { value } = child as CollectionQuery

      return {
        bool: {
          must: [{ term: { heuristicCollectionId: value } }],
        },
      }
    }
    case 'text': {
      const { value } = child as TextQuery

      return {
        nested: {
          path: 'offChainData.attributes',
          query: {
            multi_match: {
              query: value,
              fields: ['data.name', 'offChainData.attributes.value'],
              fuzziness: 'AUTO',
            },
          },
        },
      }
    }
    case 'range':
      const rangeField = getRangeField(child.value)

      return {
        bool: {
          must: [
            {
              range: {
                [rangeField]: {
                  gte: child.min,
                  lte: child.max,
                },
              },
            },
            rangeField === 'lastListPrice' && {
              term: {
                listed: true,
              },
            },
          ].filter(Boolean),
        },
      }
    default: {
      return false
    }
  }
}

export default createSingleNFTQuery
