import type { NextApiRequest, NextApiResponse } from 'next'
import ComposedQueryType from '../types/ComposedQueryType'
import { SearchResponse } from '../types/SearchResponse'
import type SearchSort from '../types/SearchSort'
import getNFTQuery from './helpers/getNFTQuery'
import { postNFTQuery } from './helpers/postQuery'

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<SearchResponse>
) => {
  try {
    const query = req.body.query as ComposedQueryType
    const sort = req.body.sort as SearchSort
    const onlyListed = Boolean(req.body.onlyListed)

    const nftQuery = getNFTQuery(query, 50, sort, onlyListed)
    const nftResult = await postNFTQuery(nftQuery, true)

    const hits = nftResult.hits
    const nfts = hits.hits.map((entry) => entry._source)
    const total = hits.total.value as number
    const cursor = nftResult._scroll_id

    res.json({ nfts, total, cursor })
  } catch (e) {
    res.status(500).end()
  }
}

export default handler
