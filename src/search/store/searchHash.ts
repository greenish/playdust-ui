import qs from 'qs'
import { selector } from 'recoil'
import * as store from './'

export const searchHash = selector<string>({
  key: 'searchHash',
  get: ({ get }) => {
    const queryValid = get(store.searchQueryValid)
    const withoutIds = queryValid.map((parent) =>
      parent.map(({ id, ...rest }) => rest)
    )
    const sort = get(store.searchSortSelected)
    const onlyListed = get(store.searchOnlyListed)

    const raw = {
      query: withoutIds,
      sort: sort?.value,
      onlyListed,
    }
    const result = qs.stringify(raw)

    return result
  },
})
