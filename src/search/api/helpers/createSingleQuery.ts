import {
  ExactAttributeQuery,
  ExactCollectionQuery,
  QueryType,
} from '../../types/ComposedQueryType'

const createSingleQuery = (child: QueryType) => {
  if (child.field === 'attribute') {
    const { trait, value } = child as ExactAttributeQuery

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

  if (child.field === 'collection') {
    const { value } = child as ExactCollectionQuery

    return {
      bool: {
        must: [
          { term: { 'updateAuthority.keyword': value.updateAuthority } },
          { term: { 'data.symbol.keyword': value.symbol } },
        ],
      },
    }
  }
}

export default createSingleQuery
