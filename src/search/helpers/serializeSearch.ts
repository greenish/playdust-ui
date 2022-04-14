import type SearchSort from '../types/SearchSort'
import type SearchState from '../types/SearchState'

const serializeSearch = (state: SearchState) => {
  const { query, sort, onlyListed } = state
  if (query.length === 0 && query[0] === undefined && !sort && !onlyListed) {
    return ''
  }

  const raw = {
    query: query.map((parent) => parent.map(({ id, ...rest }) => rest)),
    sort,
    onlyListed,
  }

  return JSON.stringify(raw)
}

interface SearchStateActual extends SearchState {
  sort: SearchSort
}

export const serializeSearchActual = (state: SearchStateActual) =>
  serializeSearch(state)

export default serializeSearch
