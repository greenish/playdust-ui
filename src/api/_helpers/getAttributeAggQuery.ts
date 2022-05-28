import { SearchRequest } from '@opensearch-project/opensearch/api/types';

const getAttributeAggQuery = (
  aggSize = 20,
  aggOptionSize = 50
): SearchRequest['body'] => ({
  size: 0,
  aggs: {
    name: {
      nested: {
        path: 'offChainData.attributes',
      },
      aggs: {
        trait: {
          terms: {
            field: 'offChainData.attributes.trait_type.keyword',
            size: aggSize,
          },
          aggs: {
            value: {
              terms: {
                field: 'offChainData.attributes.value.keyword',
                size: aggOptionSize,
              },
            },
          },
        },
      },
    },
  },
});

export default getAttributeAggQuery;
