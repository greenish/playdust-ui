import type { NextApiRequest, NextApiResponse } from 'next'
import ComposedQueryType from '../_types/ComposedQueryType'
import type SearchResponseType from '../_types/SearchResponseType'
import type SearchSortType from '../_types/SearchSortType'
import getNFTQuery from './_helpers/getNFTQuery'
import postNFTQuery from './_helpers/postNFTQuery'

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<SearchResponseType>
) => {
  try {
    const query = req.body.query as ComposedQueryType
    const sort = req.body.sort as SearchSortType
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
