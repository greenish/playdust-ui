import { NextApiRequest } from 'next';
import type TopCollectionsResponseType from '../_types/TopCollectionsResponseType';
import nextApiHandler from './_helpers/nextApiHandler';
import postCollectionQuery from './_helpers/postCollectionQuery';
import postMultiNFTQuery from './_helpers/postMultiNFTQuery';
import queriesToMultiSearch from './_helpers/queriesToMultiSearch';

const collectionPageSize = 25;
const topCollectionLimit = 100;

const getTopCollectionQuery = (page: number) => ({
  _source: {
    exclude: ['attributes'],
  },
  size: collectionPageSize,
  from: page * collectionPageSize,
  sort: [
    '_score',
    {
      totalVolume: {
        order: 'desc',
      },
    },
  ],
});

const getNFTQuery = (collectionId: string) => ({
  size: 20,
  _source: [
    'mint',
    'offChainData.image',
    'offChainData.name',
    'heuristicCollectionId',
  ],
  query: {
    bool: {
      filter: [
        {
          terms: {
            heuristicCollectionId: [collectionId],
          },
        },
        {
          exists: {
            field: 'offChainData.image',
          },
        },
      ],
    },
  },
  sort: [
    {
      rarityScore: 'asc',
    },
  ],
});

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    page?: number;
  };
}

const getTopCollections = nextApiHandler<TopCollectionsResponseType>(
  async (req: ExtendedNextApiRequest): Promise<TopCollectionsResponseType> => {
    const page: number = req.body.page || 0;

    const topCollectionQuery = getTopCollectionQuery(page);
    const topCollectionResult = await postCollectionQuery(topCollectionQuery);

    const topNFTQueries = topCollectionResult.hits.hits.map((entry) =>
      getNFTQuery(entry._id)
    );
    const multiNftQuery = queriesToMultiSearch(topNFTQueries, 'nft-metadata');
    const nftResults = await postMultiNFTQuery(multiNftQuery);
    const nftSources = nftResults.map((entry) =>
      entry.hits.hits.map((child) => child._source)
    );

    const results = topCollectionResult.hits.hits.map((collection, idx) => ({
      collection: collection._source,
      nfts: nftSources[idx],
    }));

    return {
      results,
      total: topCollectionLimit,
      page,
    };
  }
);

export default getTopCollections;
