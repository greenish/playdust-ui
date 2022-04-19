import type { NextApiRequest, NextApiResponse } from 'next'
import ComposedQueryType from '../types/ComposedQueryType'
import { SearchOverviewResponse } from '../types/SearchResponse'
import getNFTQuery from './helpers/getNFTQuery'
import { queriesToMultiSearch } from './helpers/openSearch'
import { postMultiNFTQuery } from './helpers/postQuery'

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<SearchOverviewResponse>
) => {
  try {
    const query = req.body.query as ComposedQueryType
    const collectionId = req.body.collectionId as string

    const countQuery = getNFTQuery(query, 0)
    const nftQueryListed = getNFTQuery(query, 0, undefined, true)

    const aggQuery = {
      ...nftQueryListed,
      aggs: {
        ceiling: { max: { field: 'lastListPrice' } },
        floor: { min: { field: 'lastListPrice' } },
      },
    }

    const multiQuery = queriesToMultiSearch(
      [aggQuery, countQuery],
      'nft-metadata'
    )

    const [aggResult, countResult] = await postMultiNFTQuery(multiQuery)

    const listed = aggResult.hits.total.value
    const floor = aggResult.aggregations.floor.value
    const ceiling = aggResult.aggregations.ceiling.value
    const count = countResult.hits.total.value

    res.json({
      listed,
      floor,
      ceiling,
      count,
    })
  } catch (e) {
    console.error('e', e)
    res.status(500).end()
  }
}

export default handler
