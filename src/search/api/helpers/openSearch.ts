import { OpenSearchResponse } from '../../types/OpenSearchIndex'

export const getSource = (results: OpenSearchResponse<any>) => {
  const hits = results.hits.hits
  const sources = hits.map((entry) => entry._source)

  return sources
}

export const queriesToMultiSearch = (
  queries: object[],
  index: 'nft-collection' | 'nft-metadata'
) =>
  queries
    .flatMap((entry) => {
      return [`{ "index": "${index}"}\n`, `${JSON.stringify(entry)}\n`]
    })
    .join('')
