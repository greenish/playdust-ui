import type { QueryDslQueryContainer } from '@opensearch-project/opensearch/api/types';
import QueryNodeType from '../../App/Window/_types/QueryNodeType';
import SearchFilterUnionType from '../../App/Window/_types/SearchFilterUnionType';

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

const createSingleNFTQuery = (child: QueryNodeType): QueryDslQueryContainer => {
  switch (child.field) {
    case 'attribute': {
      const { key, value } = child;

      return {
        nested: {
          path: 'offChainData.attributes',
          query: {
            bool: {
              must: [
                key !== ''
                  ? {
                      match: {
                        'offChainData.attributes.trait_type.keyword': key,
                      },
                    }
                  : {},
                value !== ''
                  ? {
                      match: {
                        'offChainData.attributes.value.keyword': value,
                      },
                    }
                  : {},
              ],
            },
          },
        },
      };
    }
    case 'collection': {
      const { value } = child;

      return {
        term: {
          heuristicCollectionId: value,
        },
      };
    }
    case 'text': {
      const { value } = child;

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

      const mustBase = [
        {
          range: {
            [rangeField]: {
              gte: child.min,
              lte: child.max,
            },
          },
        },
      ];

      const must =
        rangeField === 'lastListPrice'
          ? [
              ...mustBase,
              {
                term: {
                  listed: true,
                },
              },
            ]
          : mustBase;

      return {
        bool: {
          must,
        },
      };
    }
    default: {
      const n: never = child;

      return n;
    }
  }
};

export default createSingleNFTQuery;
