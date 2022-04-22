import type { NextApiRequest, NextApiResponse } from 'next'
import { TopCollectionResponse } from '../types/SearchResponse'
import { queriesToMultiSearch } from './helpers/openSearch'
import {
  postCollectionQuery,
  postCollectionScrollQuery,
  postMultiNFTQuery,
} from './helpers/postQuery'

const topCollectionLimit = 100

const topCollectionQuery = {
  _source: {
    exclude: ['attributes'],
  },
  size: 25,
  sort: [
    '_score',
    {
      totalVolume: {
        order: 'desc',
      },
    },
  ],
}

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
})

const fetchTopCollections = async (cursor?: string) => {
  if (cursor) {
    const result = await postCollectionScrollQuery(cursor)

    return result
  }

  const topCollectionResult = await postCollectionQuery(
    topCollectionQuery,
    true
  )

  return topCollectionResult
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<TopCollectionResponse>
) => {
  try {
    const cursor = req.body.cursor as string | undefined

    const topCollectionResult = await fetchTopCollections(cursor)

    const topNFTQueries = topCollectionResult.hits.hits.map((entry) =>
      getNFTQuery(entry._id)
    )
    const multiNftQuery = queriesToMultiSearch(topNFTQueries, 'nft-metadata')
    const nftResults = await postMultiNFTQuery(multiNftQuery)
    const nftSources = nftResults.map((entry) =>
      entry.hits.hits.map((child) => child._source)
    )

    const results = topCollectionResult.hits.hits.map((collection, idx) => ({
      collection: collection._source,
      nfts: nftSources[idx],
    }))

    res.json({
      results,
      cursor: topCollectionResult._scroll_id,
      total: topCollectionLimit,
    })
  } catch (e) {
    res.status(500).end(e)
  }
}

export default handler
