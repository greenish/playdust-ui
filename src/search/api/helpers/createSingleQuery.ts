import {
  AttributeQuery,
  CollectionQuery,
  QueryType,
  TextQuery,
} from '../../types/ComposedQueryType'

const createSingleQuery = (child: QueryType) => {
  switch (child.field) {
    case 'attribute': {
      const { trait, value } = child as AttributeQuery

      return {
        nested: {
          path: 'offChainData.attributes',
          query: {
            bool: {
              must: [
                {
                  match: {
                    'offChainData.attributes.trait_type.keyword': trait,
                  },
                },
                child.value && {
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
          must: [
            { term: { 'updateAuthority.keyword': value.updateAuthority } },
            { term: { 'data.symbol.keyword': value.symbol } },
          ],
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
              fields: [
                'data.name',
                'data.symbol',
                'offChainData.attributes.value',
              ],
              fuzziness: 'AUTO',
            },
          },
        },
      }
    }
    default: {
      return false
    }
  }
}

export default createSingleQuery
