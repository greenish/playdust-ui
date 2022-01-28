import axios from 'axios'
import esb from 'elastic-builder'
import type { NextApiRequest, NextApiResponse } from 'next'

const { OPENSEARCH_USER, OPENSEARCH_PASSWORD, OPENSEARCH_URL } = process.env

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const searchTerm = req.query.term as string
  const requestBody = esb
    .requestBodySearch()
    .query(esb.matchQuery('data.creators.address', searchTerm))
    .collapse('data.creators.address')
    .suggest(esb.termSuggester('nameSuggestor', 'data.name', searchTerm))

  try {
    const { data } = await axios.post(
      `${OPENSEARCH_URL}/_search`,
      requestBody.toJSON(),
      {
        auth: {
          username: OPENSEARCH_USER as string,
          password: OPENSEARCH_PASSWORD as string,
        },
      }
    )

    res.json(data)
  } catch (e) {
    res.json({ e })
  }
}

export default handler
