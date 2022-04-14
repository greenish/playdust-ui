import { selector } from 'recoil'
import serializeSearch from '../helpers/serializeSearch'
import * as store from './'

export const searchSerializedSelected = selector<string>({
  key: 'searchSerializedSelected',
  get: ({ get }) => {
    const query = get(store.searchQueryValid)
    const sort = get(store.searchSort)
    const onlyListed = get(store.searchOnlyListed)

    return serializeSearch({ query, sort, onlyListed })
  },
})
