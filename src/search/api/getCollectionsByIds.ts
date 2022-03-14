import type { NextApiRequest, NextApiResponse } from 'next'
import { SearchCollectionResponse } from '../types/SearchResponse'
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
    const ids = req.body as string[]

    const esQuery = {
      size: ids.length,
      query: {
        bool: {
          filter: {
            ids: {
              values: ids,
            },
          },
        },
      },
    }

    const result = await postCollectionQuery(esQuery)

    res.json(cleanResult(result))
  } catch (e) {
    res.status(500).end()
  }
}

export default handler
