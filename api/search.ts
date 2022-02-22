import type { NextApiRequest, NextApiResponse } from 'next'
import ComposedQueryType from '../types/ComposedQueryType'
import SearchMetadata from '../types/SearchMetadata'
import SearchResponse from '../types/SearchResponse'
import getComposedQuery from './helpers/getComposedQuery'
import postQuery from './helpers/postQuery'

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<SearchResponse>
) => {
  try {
    const query = req.body as ComposedQueryType
    const esQuery = getComposedQuery(query, 25)
    const result = await postQuery(esQuery)

    const hits = result.hits.hits as any[]

    const results = hits.map((entry) => entry._source) as SearchMetadata[]
    const total = result.hits.total.value as number

    res.json({ results, total })
  } catch (e) {
    res.status(500)
  }
}

export default handler
