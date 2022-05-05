import type AttributeQueryNodeType from '../../_types/AttributeQueryNodeType';
import type CollectionQueryNodeTYpe from '../../_types/CollectionQueryNodeType';
import type QueryNodeType from '../../_types/QueryNodeType';
import type SearchFilterUnionType from '../../_types/SearchFilterUnionType';
import type TextQueryNodeType from '../../_types/TextQueryNodeType';

const getRangeField = (field: SearchFilterUnionType) => {
  switch (field) {
    case 'list-price':
      return 'lastListPrice';
    case 'sale-price':
      return 'lastTradePrice';
    case 'rarity-score':
      return 'normalizedRarityScore';
    default: {
      const n: never = field;

      return n;
    }
  }
};

const createSingleNFTQuery = (child: QueryNodeType) => {
  switch (child.field) {
    case 'attribute': {
      const { trait, value } = child as AttributeQueryNodeType;

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
      };
    }
    case 'collection': {
      const { value } = child as CollectionQueryNodeTYpe;

      return {
        term: {
          heuristicCollectionId: value,
        },
      };
    }
    case 'text': {
      const { value } = child as TextQueryNodeType;

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
      };
    }
    case 'range': {
      const rangeField = getRangeField(child.value);

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
      };
    }
    default: {
      return false;
    }
  }
};

export default createSingleNFTQuery;
