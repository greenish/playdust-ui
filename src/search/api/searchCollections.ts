import type { NextApiRequest, NextApiResponse } from 'next'
import ComposedQueryType from '../types/ComposedQueryType'
import { SearchCollectionResponse } from '../types/SearchResponse'
import getCollectionQuery from './helpers/getCollectionQuery'
import { postCollectionQuery } from './helpers/postQuery'

const cleanResult = (result: any) => {
  const hits = result.hits.hits as any[]
  const results = hits.map(
    (entry) => entry._source
  ) as SearchCollectionResponse['results']

  return { results }
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<SearchCollectionResponse>
) => {
  try {
    const query = req.body.query as ComposedQueryType

    const freeTextSearches = query
      .map((parent) => parent.filter((child) => child.field === 'text'))
      .filter((parent) => parent.length)

    if (!freeTextSearches.length) {
      return res.json({ results: [] })
    }

    const collectionQuery = getCollectionQuery(freeTextSearches)
    const result = await postCollectionQuery(collectionQuery)

    res.json(cleanResult(result))
  } catch (e) {
    res.status(500).end()
  }
}

export default handler
