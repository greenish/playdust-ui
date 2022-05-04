import type { SearchStateType } from '../_atoms/searchState'

const serializeSearch = (state: SearchStateType) => {
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

export default serializeSearch
