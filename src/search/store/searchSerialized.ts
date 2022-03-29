import { selector } from 'recoil'
import ComposedQueryType from '../types/ComposedQueryType'
import * as store from './'
import { SearchSortValue } from './'

const serializeSearch = (
  query: ComposedQueryType,
  sort?: SearchSortValue,
  onlyListed?: boolean
) => {
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

export const searchSerializedActual = selector<string>({
  key: 'searchSerializedActual',
  get: ({ get }) => {
    const query = get(store.searchQueryValid)
    const sort = get(store.searchSortActual)
    const onlyListed = get(store.searchOnlyListed)

    return serializeSearch(query, sort.value, onlyListed)
  },
})

export const searchSerializedSelected = selector<string>({
  key: 'searchSerializedSelected',
  get: ({ get }) => {
    const query = get(store.searchQueryValid)
    const sort = get(store.searchSortSelected)
    const onlyListed = get(store.searchOnlyListed)

    return serializeSearch(query, sort?.value, onlyListed)
  },
})
