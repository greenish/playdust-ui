import type { QueryDslQueryContainer } from '@opensearch-project/opensearch/api/types';
import OpenSearchCollectionSourceType from '../../App/Window/WindowSwitch/_types/OpenSearchCollectionSourceType';
import makeSearchOS from './makeSearchOS';

const existsQuery: QueryDslQueryContainer[] = [
  {
    bool: {
      must: [
        {
          exists: {
            field: 'id',
          },
        },
        {
          bool: {
            should: [
              {
                exists: {
                  field: 'name',
                },
              },
              {
                exists: {
                  field: 'symbol',
                },
              },
            ],
            minimum_should_match: 1,
          },
        },
      ],
    },
  },
];

type SearchCollectionsType = {
  useMust?: boolean;
  includeAttributes?: boolean;
};

const searchCollections = makeSearchOS<
  OpenSearchCollectionSourceType,
  SearchCollectionsType
>('nft-collection', OpenSearchCollectionSourceType, (body, options) => {
  const wrappedQuery: QueryDslQueryContainer = {
    bool: {
      [options?.useMust ? 'must' : 'filter']: [
        ...existsQuery,
        body?.query,
      ].filter(Boolean),
    },
  };

  return {
    ...body,
    query: wrappedQuery,
    _source: options?.includeAttributes
      ? undefined
      : {
          exclude: ['attributes'],
        },
  };
});

export default searchCollections;
