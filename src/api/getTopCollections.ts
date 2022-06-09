import type { SearchRequest } from '@opensearch-project/opensearch/api/types';
import { defaulted, number, type } from 'superstruct';
import type TopCollectionsResponseType from '../App/Window/WindowSwitch/Home/_types/TopCollectionsResponseType';
import nextApiHandler from './_helpers/nextApiHandler';
import searchCollections from './_helpers/searchCollections';
import searchNFTs from './_helpers/searchNFTs';

const collectionPageSize = 25;
const topCollectionLimit = 100;

const getTopCollectionQuery = (page: number): SearchRequest['body'] => ({
  _source: {
    exclude: ['attributes'],
  },
  size: collectionPageSize,
  from: page * collectionPageSize,
  sort: [
    '_score',
    {
      'volume.global.total': {
        order: 'desc',
      },
    },
  ],
});

const getNFTQuery = (collectionId: string): SearchRequest['body'] => ({
  size: 20,
  _source: ['mint', 'image', 'name'],
  query: {
    bool: {
      filter: [
        {
          nested: {
            path: 'collections',
            query: {
              term: {
                'collections.id': collectionId,
              },
            },
          },
        },
        {
          exists: {
            field: 'image',
          },
        },
      ],
    },
  },
  sort: [
    {
      normalizedRarityScore: 'desc',
    },
  ],
});

const TopCollectionsBody = type({
  page: defaulted(number(), 0),
});

const getTopCollections = nextApiHandler<TopCollectionsResponseType>(
  async (req) => {
    const { page } = TopCollectionsBody.create(req);

    const topCollectionQuery = getTopCollectionQuery(page);
    const [topCollectionResult] = await searchCollections([topCollectionQuery]);

    const topNFTQueries = topCollectionResult.sources.map((entry) =>
      getNFTQuery(entry.id)
    );

    const nftResults = await searchNFTs(topNFTQueries);
    const results = topCollectionResult.sources.map((collection, idx) => ({
      collection,
      nfts: nftResults[idx].sources,
    }));

    return {
      results,
      total: topCollectionLimit,
      page,
    };
  }
);

export default getTopCollections;
