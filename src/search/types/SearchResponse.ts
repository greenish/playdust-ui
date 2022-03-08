import type SearchMetadata from '../../../types/SearchMetadata'

interface SearchResponse {
  results: SearchMetadata[]
  total: number
  cursor: string
}

export default SearchResponse
