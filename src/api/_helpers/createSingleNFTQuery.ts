import type { QueryDslQueryContainer } from '@opensearch-project/opensearch/api/types';
import type QueryNodeType from '../../_types/QueryNodeType';
import type SearchFilterUnionType from '../../_types/SearchFilterUnionType';

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
      const { trait, value } = child;

      return {
        nested: {
          path: 'offChainData.attributes',
          query: {
            bool: {
              must: [
                trait !== ''
                  ? {
                      match: {
                        'offChainData.attributes.trait_type.keyword': trait,
                      },
                    }
                  : {},
                value?.length > 0
                  ? {
                      bool: {
                        should: value.map((entry) => ({
                          match: {
                            'offChainData.attributes.value.keyword': entry,
                          },
                        })),
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
