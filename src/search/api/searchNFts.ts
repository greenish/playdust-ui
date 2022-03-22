import type { NextApiRequest, NextApiResponse } from 'next'
import SearchMetadata from '../../../types/SearchMetadata'
import { SearchSortValue } from '../store'
import ComposedQueryType from '../types/ComposedQueryType'
import { SearchNFTResponse } from '../types/SearchResponse'
import getNFTQuery from './helpers/getNFTQuery'
import { postNFTQuery, postScrollQuery } from './helpers/postQuery'

const cleanResult = (result: any): SearchNFTResponse => {
  const hits = result.hits.hits as any[]

  const results = hits.map((entry) => entry._source) as SearchMetadata[]
  const total = result.hits.total.value as number
  const cursor = result._scroll_id

  return { results, total, cursor }
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<SearchNFTResponse>
) => {
  try {
    const prevCursor = req.body.cursor as string

    if (prevCursor) {
      const result = await postScrollQuery(prevCursor)

      return res.json(cleanResult(result))
    }

    const query = req.body.query as ComposedQueryType
    const sort = req.body.sort as SearchSortValue
    const onlyListed = Boolean(req.body.onlyListed)

    const esQuery = getNFTQuery(query, 50, sort, onlyListed)
    const result = await postNFTQuery(esQuery, true)

    res.json(cleanResult(result))
  } catch (e) {
    res.status(500).end()
  }
}

export default handler
