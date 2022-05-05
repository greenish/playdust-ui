import type { NextApiRequest, NextApiResponse } from 'next';
import type CollectionOverviewResponseType from '../_types/CollectionOverviewResponseType';
import type OpenSearchCollectionSourceType from '../_types/OpenSearchCollectionSourceType';
import postCollectionQuery from './_helpers/postCollectionQuery';

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

const getSimilarCollectionQuery = ({
  id,
  name,
  description,
  symbol,
}: Partial<OpenSearchCollectionSourceType>) => ({
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
              name && {
                match: {
                  name,
                },
              },
              symbol && {
                match: {
                  symbol,
                },
              },
              description && {
                match: {
                  description,
                },
              },
              {
                exists: {
                  field: 'attributes',
                },
              },
            ].filter(Boolean),
          },
        },
      ],
    },
  },
  sort: [
    '_score',
    {
      totalVolume: {
        order: 'desc',
      },
    },
  ],
});

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<CollectionOverviewResponseType>
) => {
  try {
    const collectionId = req.query.id as string;

    const seedQuery = getSeedQuery(collectionId);
    const seedResult = await postCollectionQuery(seedQuery);

    const seed = seedResult.hits.hits[0]._source;

    const similarCollectionQuery = getSimilarCollectionQuery(seed);
    const similarResult = await postCollectionQuery(similarCollectionQuery);
    const similar: OpenSearchCollectionSourceType[] = similarResult.hits.hits
      .map(({ _source }) => ({
        ..._source,
        totalVolume: _source.totalVolume || 0,
      }))
      .sort((a, b) => b.totalVolume - a.totalVolume);

    res.json({
      ...seed,
      totalVolume: seed.totalVolume || 0,
      elementCount: seed.elementCount || 0,
      similar,
    });
  } catch (e) {
    console.error('e', e);
    res.status(500).end();
  }
};

export default handler;
