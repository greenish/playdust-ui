import type { QueryDslQueryContainer } from '@opensearch-project/opensearch/api/types';
import QueryNodeType from '../../App/Window/_types/QueryNodeType';
import RangeValueUnionType from '../../App/Window/_types/RangeValueUnionType';

const getRangeField = (field: RangeValueUnionType) => {
  switch (field) {
    case 'list-price':
      return 'lastListPrice';
    case 'sale-price':
      return 'lastSalePrice';
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
          path: 'attributes',
          query: {
            bool: {
              must: [
                {
                  match: {
                    'attributes.key.keyword': key,
                  },
                },
                {
                  match: {
                    'attributes.value.keyword': value,
                  },
                },
              ],
            },
          },
        },
      };
    }
    case 'collection': {
      const { value } = child;

      return {
        nested: {
          path: 'collections',
          query: {
            term: {
              'collections.id': value,
            },
          },
        },
      };
    }
    case 'text': {
      const { value } = child;

      return {
        nested: {
          path: 'attributes',
          query: {
            multi_match: {
              query: value,
              fields: ['name', 'attributes.value'],
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
