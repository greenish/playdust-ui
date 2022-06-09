import {
  QueryDslQueryContainer,
  SearchRequest,
} from '@opensearch-project/opensearch/api/types';
import type CollectionOverviewResponseType from '../App/Window/WindowSwitch/Search/SearchOverview/CollectionOverview/_types/CollectionOverviewResponseType';
import type OpenSearchCollectionSourceType from '../App/Window/_types/OpenSearchCollectionSourceType';
import nextApiHandler from './_helpers/nextApiHandler';
import searchCollections from './_helpers/searchCollections';

const getSeedQuery = (collectionId: string) => ({
  size: 1,
  _source: {
    exclude: ['attributes'],
  },
  query: {
    ids: {
      values: [collectionId],
    },
  },
});

const getMatchField = (
  input: string | null | undefined
): QueryDslQueryContainer[] =>
  input
    ? [
        {
          match: {
            input,
          },
        },
      ]
    : [];

const getSimilarCollectionQuery = ({
  id,
  name,
  description,
  symbol,
}: OpenSearchCollectionSourceType): SearchRequest['body'] => ({
  _source: {
    exclude: ['attributes'],
  },
  size: 20,
  query: {
    bool: {
      must: [
        {
          bool: {
            must_not: {
              term: {
                id,
              },
            },
          },
        },
        {
          bool: {
            should: [
              ...getMatchField(name),
              ...getMatchField(symbol),
              ...getMatchField(description),
              {
                exists: {
                  field: 'attributes',
                },
              },
            ],
          },
        },
      ],
    },
  },
  sort: [
    '_score',
    {
      'volume.global.total': {
        order: 'desc',
      },
    },
  ],
});

const getCollectionOverview = nextApiHandler<CollectionOverviewResponseType>(
  async (req) => {
    const collectionId = req.query.id as string;

    const seedQuery = getSeedQuery(collectionId);
    const [seedResult] = await searchCollections([seedQuery]);
    const seed = seedResult.sources[0];

    const similarCollectionQuery = getSimilarCollectionQuery(seed);
    const [similarResult] = await searchCollections([similarCollectionQuery]);

    return {
      ...seed,
      elementCount: seed.elementCount || 0,
      similar: similarResult.sources,
    };
  }
);

export default getCollectionOverview;
