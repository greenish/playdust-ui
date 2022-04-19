import type { NextApiRequest, NextApiResponse } from 'next'
import { CollectionSource } from '../types/OpenSearchIndex'
import { CollectionOverviewResponse } from '../types/SearchResponse'
import { postCollectionQuery } from './helpers/postQuery'

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
})

const getSimilarCollectionQuery = ({
  id,
  name,
  description,
  symbol,
}: Partial<CollectionSource>) => ({
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
})

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<CollectionOverviewResponse>
) => {
  try {
    const collectionId = req.query.id as string

    const seedQuery = getSeedQuery(collectionId)
    const seedResult = await postCollectionQuery(seedQuery)

    const seed = seedResult.hits.hits[0]._source

    const similarCollectionQuery = getSimilarCollectionQuery(seed)
    const similarResult = await postCollectionQuery(similarCollectionQuery)
    const similar: CollectionSource[] = similarResult.hits.hits
      .map(({ _source }) => ({
        ..._source,
        totalVolume: _source.totalVolume || 0,
      }))
      .sort((a, b) => b.totalVolume - a.totalVolume)

    res.json({
      ...seed,
      totalVolume: seed.totalVolume || 0,
      elementCount: seed.elementCount || 0,
      similar,
    })
  } catch (e) {
    console.error('e', e)
    res.status(500).end()
  }
}

export default handler
