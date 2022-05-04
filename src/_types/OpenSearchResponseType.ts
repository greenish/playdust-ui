import OpenSearchHighlightType from './OpenSearchHighlightType'

interface OpenSearchResponseType<T> {
  _scroll_id: string
  hits: {
    total: {
      value: number
    }
    hits: {
      _id: string
      _source: T
      highlight?: OpenSearchHighlightType
    }[]
  }
  aggregations: any
}

export default OpenSearchResponseType
