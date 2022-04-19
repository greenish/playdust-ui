import type { NextApiRequest, NextApiResponse } from 'next'
import ComposedQueryType from '../types/ComposedQueryType'
import { SearchAggregationResponse } from '../types/SearchResponse'
import { getAllAttributeQueries } from './helpers/getAllAttributes'
import getNFTQuery from './helpers/getNFTQuery'
import { queriesToMultiSearch } from './helpers/openSearch'
import { postMultiNFTQuery } from './helpers/postQuery'

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<SearchAggregationResponse>
) => {
  try {
    const query = req.body.query as ComposedQueryType
    const onlyListed = Boolean(req.body.onlyListed)

    const nftQuery = getNFTQuery(query, 0, undefined, onlyListed)

    const { attributeQueries, cleanAttributes } = getAllAttributeQueries(
      query,
      nftQuery
    )

    const attributeMultiQuery = queriesToMultiSearch(
      attributeQueries,
      'nft-metadata'
    )

    const attributeResults = await postMultiNFTQuery(attributeMultiQuery)
    const attributes = cleanAttributes(attributeResults)

    res.json({ attributes })
  } catch (e) {
    res.status(500).end()
  }
}

export default handler
