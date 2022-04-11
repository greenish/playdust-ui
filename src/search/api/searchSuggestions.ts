import type { NextApiRequest, NextApiResponse } from 'next'
import { SearchSuggestionResponse } from '../types/SearchResponse'
import { queriesToMultiSearch } from './helpers/openSearch'
import { postMultiQuery } from './helpers/postQuery'

const getAttributeQuery = (term: string) => ({
  size: 25,
  _source: ['attributes.name', 'attributes.values.v'],
  query: {
    multi_match: {
      fields: ['attributes.name', 'attributes.values.v'],
      query: term,
    },
  },
  highlight: {
    fields: {
      'attributes.name': {},
      'attributes.values.v': {},
      description: {},
      name: {},
    },
  },
  sort: [
    '_score',
    {
      totalVolume: {
        order: 'desc',
      },
    },
  ],
})

const getCollectionQuery = (term: string) => ({
  size: 10,
  query: {
    multi_match: {
      fields: ['description', 'name', 'symbol'],
      query: term,
    },
  },
  _source: {
    exclude: ['attributes'],
  },
  highlight: {
    fields: {
      description: {},
      name: {},
      symbol: {},
    },
  },
  sort: [
    {
      totalVolume: {
        order: 'desc',
      },
    },
  ],
})

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<SearchSuggestionResponse>
) => {
  try {
    const term = req.body.term as string

    const attributeQuery = getAttributeQuery(term)
    const collectionQuery = getCollectionQuery(term)

    const multiCollectionQuery = queriesToMultiSearch(
      [collectionQuery, attributeQuery],
      'nft-collection'
    )

    const [collectionResult, attributeResult] = await postMultiQuery(
      multiCollectionQuery
    )

    const attributes = attributeResult.hits.hits
      .map((entry) => entry.highlight!)
      .reduce<SearchSuggestionResponse['attributes']>(
        (acc, curr) => {
          const values = curr['attributes.values.v'] || []
          const names = curr['attributes.name'] || []

          return {
            names: [...new Set([...acc.names, ...names])],
            values: [...new Set([...acc.values, ...values])],
          }
        },
        { names: [], values: [] }
      )

    const collections = collectionResult.hits.hits.map((entry) => ({
      source: entry._source,
      highlight: entry.highlight!,
    }))

    res.json({ collections, attributes })
  } catch (e) {
    res.status(500).end()
  }
}

export default handler
