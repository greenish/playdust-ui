import esb from 'elastic-builder'
import type { NextApiRequest, NextApiResponse } from 'next'
import openSearch from '../../../helpers/openSearch'

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<Promise<any>>
) => {
  const mint = req.query.mint as string
  const requestBody = esb
    .requestBodySearch()
    .query(esb.matchQuery('mint', mint))
    .toJSON()
  const result = await openSearch(requestBody)
  const source = result?.hits?.hits[0]?._source

  res.status(200).json(source)
}

export default handler
