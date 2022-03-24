import type { NextApiRequest, NextApiResponse } from 'next'
import { CollectionSource } from '../types/OpenSearchIndex'
import { postCollectionQuery } from './helpers/postQuery'

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<CollectionSource[]>
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

    const response = await postCollectionQuery(esQuery)
    const results = response.hits.hits.map((entry) => entry._source)

    res.json(results)
  } catch (e) {
    res.status(500).end()
  }
}

export default handler
