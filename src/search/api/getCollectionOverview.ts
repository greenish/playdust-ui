import type { NextApiRequest, NextApiResponse } from 'next'
import {
  CollectionOverviewResponse,
  CollectionResponse,
  SearchCollectionResponse,
} from '../types/SearchResponse'
import {
  postCollectionQuery,
  postNFTQuery,
  postTransactionQuery,
} from './helpers/postQuery'

const size = 1000

const fetchSimilarResults = async (collectionId: string) => {
  const initialQuery = {
    size: 1,
    query: {
      ids: {
        values: [collectionId],
      },
    },
  }

  const result = await postCollectionQuery(initialQuery)
  const { symbol } = result.hits.hits[0]._source

  const similarQuery = {
    size,
    _source: {
      exclude: ['attributes'],
    },
    query: {
      bool: {
        must: [
          {
            match: {
              'symbol.keyword': symbol,
            },
          },
        ],
      },
    },
  }

  const similarResult = await postCollectionQuery(similarQuery)
  const hits = similarResult.hits.hits as any[]
  const results = hits.map(
    (entry) => entry._source
  ) as SearchCollectionResponse['results']

  return results
}

const fetchListedResults = async (collectionId: string) => {
  const listedQuery = {
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
              'heuristicCollectionId.keyword': [collectionId],
            },
          },
        ],
      },
    },
    aggs: {
      floor: {
        min: {
          field: 'lastListPrice',
        },
      },
    },
    size: 0,
  }

  const listedResult = await postNFTQuery(listedQuery)

  const listedItems = listedResult.hits.total.value
  const floorPrice = listedResult?.aggregations?.floor?.value || 0

  return { listedItems, floorPrice }
}

const fetchTotalVolume = async (
  collections: CollectionResponse[],
  collectionId: string
) => {
  const ids = collections.map((entry) => entry.id)

  const volumeQuery = {
    query: {
      bool: {
        filter: [
          {
            term: {
              'type.keyword': 'Exchange',
            },
          },
          {
            terms: {
              'collection.keyword': ids,
            },
          },
        ],
      },
    },
    aggs: {
      Collection: {
        terms: {
          field: 'collection.keyword',
          size,
          order: {
            TotalVolume: 'desc',
          },
        },
        aggs: {
          TotalVolume: {
            sum: {
              field: 'price',
            },
          },
        },
      },
    },
    size: 0,
  }

  const volumeResult = await postTransactionQuery(volumeQuery)

  const volume = volumeResult.aggregations.Collection.buckets
  const withVolume = collections.map((collection) => {
    const found = volume.find((entry: any) => entry.key === collection.id)

    return {
      ...collection,
      volume: found ? found.TotalVolume.value : 0,
    }
  })

  return {
    collection: withVolume.find((entry) => entry.id === collectionId)!,
    similar: withVolume
      .filter((entry) => entry.id !== collectionId)
      .sort((a, b) => b.volume - a.volume),
  }
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<CollectionOverviewResponse>
) => {
  try {
    const collectionId = req.query.id as string

    const [cleaned, { floorPrice, listedItems }] = await Promise.all([
      fetchSimilarResults(collectionId),
      fetchListedResults(collectionId),
    ])
    const { collection, similar } = await fetchTotalVolume(
      cleaned,
      collectionId
    )

    res.setHeader('Cache-Control', 'max-age=900, s-maxage=900')
    res.json({
      ...collection,
      listedItems,
      floorPrice,
      similar,
    })
  } catch (e) {
    console.error('e', e)
    res.status(500).end()
  }
}

export default handler
