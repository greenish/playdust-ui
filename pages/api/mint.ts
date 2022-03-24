import esb from 'elastic-builder'
import type { NextApiRequest, NextApiResponse } from 'next'
import { postNFTQuery } from '../../src/search/api/helpers/postQuery'
import { NFTSource } from '../../src/search/types/OpenSearchIndex'

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<NFTSource>
) => {
  const mintAddress = req.query.address

  if (typeof mintAddress === 'string') {
    const requestBody = esb
      .requestBodySearch()
      .query(esb.matchQuery('mint', mintAddress))
      .toJSON()
    const result = await postNFTQuery(requestBody)
    const source = result?.hits?.hits[0]?._source

    res.status(200).json(source)
  } else {
    res.status(400)
  }
}

export default handler
