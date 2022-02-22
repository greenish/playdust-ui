import type SearchMetadata from './SearchMetadata'

interface SearchResponse {
  results: SearchMetadata[]
  total: number
}

export default SearchResponse
