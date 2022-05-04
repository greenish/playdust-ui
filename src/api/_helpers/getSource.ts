import type OpenSearchResponseType from '../../_types/OpenSearchResponseType'

const getSource = (results: OpenSearchResponseType<any>) => {
  const hits = results.hits.hits
  const sources = hits.map((entry) => entry._source)

  return sources
}

export default getSource
