import type { NextApiRequest, NextApiResponse } from 'next'
import ComposedQueryType from '../types/ComposedQueryType'
import SearchMetadata from '../types/SearchMetadata'
import SearchResponse from '../types/SearchResponse'
import getComposedQuery from './helpers/getComposedQuery'
import postQuery, { postScrollQuery } from './helpers/postQuery'

const cleanResult = (result: any) => {
  const hits = result.hits.hits as any[]

  const results = hits.map((entry) => entry._source) as SearchMetadata[]
  const total = result.hits.total.value as number
  const cursor = result._scroll_id

  return { results, total, cursor }
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<SearchResponse>
) => {
  try {
    const prevCursor = req.body.cursor as string

    if (prevCursor) {
      const result = await postScrollQuery(prevCursor)

      return res.json(cleanResult(result))
    }

    const query = req.body.query as ComposedQueryType
    const sort = req.body.sort as Object
    const esQuery = getComposedQuery(query, 25, sort)
    const result = await postQuery(esQuery, true)

    res.json(cleanResult(result))
  } catch (e) {
    res.status(500)
  }
}

export default handler
