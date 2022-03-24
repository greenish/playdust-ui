import type { NextApiRequest, NextApiResponse } from 'next'
import { SearchSortValue } from '../store'
import ComposedQueryType from '../types/ComposedQueryType'
import { SearchResponse } from '../types/SearchResponse'
import { getAllAttributeQueries } from './helpers/getAllAttributes'
import getCollectionQuery from './helpers/getCollectionQuery'
import getNFTQuery from './helpers/getNFTQuery'
import { getSource, queriesToMultiSearch } from './helpers/openSearch'
import { postMultiQuery, postNFTQuery } from './helpers/postQuery'

const fetchMultiSearch = async (query: ComposedQueryType, nftQuery: object) => {
  const { attributeQueries, cleanAttributes } = getAllAttributeQueries(
    query,
    nftQuery
  )
  const collectionQuery = getCollectionQuery(query)

  const attributeMultiQuery = queriesToMultiSearch(
    attributeQueries,
    'nft-metadata'
  )

  const isCollectionQuery = query.find((parent) => {
    if (parent.length === 1) {
      return parent[0].field === 'collection'
    }

    return false
  })

  if (!collectionQuery || isCollectionQuery) {
    const attributeResults = (await postMultiQuery(attributeMultiQuery))
      .responses

    return {
      attributes: cleanAttributes(attributeResults),
      collections: [],
    }
  }

  const collectionMultiQuery = queriesToMultiSearch(
    [collectionQuery],
    'nft-collection'
  )
  const combinedMultiQuery = `${collectionMultiQuery}${attributeMultiQuery}`
  const [collections, ...attributeResults] = (
    await postMultiQuery(combinedMultiQuery)
  ).responses

  return {
    attributes: cleanAttributes(attributeResults),
    collections: getSource(collections),
  }
}

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<SearchResponse>
) => {
  try {
    const query = req.body.query as ComposedQueryType
    const sort = req.body.sort as SearchSortValue
    const onlyListed = Boolean(req.body.onlyListed)

    const nftQuery = getNFTQuery(query, 50, sort, onlyListed)

    const [nftResult, { attributes, collections }] = await Promise.all([
      postNFTQuery(nftQuery, true),
      fetchMultiSearch(query, nftQuery),
    ])

    const hits = nftResult.hits
    const nfts = hits.hits.map((entry) => entry._source)
    const total = hits.total.value as number
    const cursor = nftResult._scroll_id

    res.json({ nfts, total, cursor, attributes, collections })
  } catch (e) {
    res.status(500).end()
  }
}

export default handler
