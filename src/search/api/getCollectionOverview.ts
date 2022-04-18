import type { NextApiRequest, NextApiResponse } from 'next'
import { CollectionSource } from '../types/OpenSearchIndex'
import { CollectionOverviewResponse } from '../types/SearchResponse'
import { queriesToMultiSearch } from './helpers/openSearch'
import { postCollectionQuery, postMultiQuery } from './helpers/postQuery'

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

const getListedQuery = (collectionId: string) => ({
  query: {
    bool: {
      filter: [
        {
          term: {
            listed: true,
          },
        },
        {
          terms: {
            heuristicCollectionId: [collectionId],
          },
        },
      ],
    },
  },
  size: 0,
})

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<CollectionOverviewResponse>
) => {
  try {
    const collectionId = req.query.id as string

    const seedQuery = getSeedQuery(collectionId)
    const listedQuery = getListedQuery(collectionId)
    const collectionMultiQuery = queriesToMultiSearch(
      [seedQuery],
      'nft-collection'
    )
    const nftMultiQuery = queriesToMultiSearch([listedQuery], 'nft-metadata')
    const multiQuery = collectionMultiQuery + nftMultiQuery

    const [seedResult, listedResults] = await postMultiQuery(multiQuery)

    const seed = seedResult.hits.hits[0]._source
    const listed = listedResults?.hits?.total?.value || 0

    const similarCollectionQuery = getSimilarCollectionQuery(seed)
    const similarResult = await postCollectionQuery(similarCollectionQuery)
    const similar: CollectionSource[] = similarResult.hits.hits
      .map(({ _source }) => ({
        ..._source,
        totalVolume: _source.totalVolume || 0,
      }))
      .sort((a, b) => b.totalVolume - a.totalVolume)

    res.setHeader('Cache-Control', 'max-age=300, s-maxage=300')
    res.json({
      ...seed,
      totalVolume: seed.totalVolume || 0,
      elementCount: seed.elementCount || 0,
      similar,
      listed,
    })
  } catch (e) {
    console.error('e', e)
    res.status(500).end()
  }
}

export default handler
