import type { NextApiRequest, NextApiResponse } from 'next'
import { SearchCursorResponse } from '../types/SearchResponse'
import { postNFTScrollQuery } from './helpers/postQuery'

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<SearchCursorResponse>
) => {
  try {
    const cursor = req.body.cursor as string
    const result = await postNFTScrollQuery(cursor)

    return res.json({
      cursor: result._scroll_id,
      nfts: result.hits.hits.map((entry) => entry._source),
    })
  } catch (e) {
    res.status(500).end()
  }
}

export default handler
