import type ComposedQueryType from './ComposedQueryType'
import type SearchSort from './SearchSort'

interface SearchState {
  query: ComposedQueryType
  sort?: SearchSort
  onlyListed?: boolean
}

export default SearchState
