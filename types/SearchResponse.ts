import type SearchMetadata from './SearchMetadata'

interface SearchResponse {
  results: SearchMetadata[]
  total: number
  cursor: string
}

export default SearchResponse
