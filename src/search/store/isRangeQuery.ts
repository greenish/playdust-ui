import { selector } from 'recoil'
import * as store from './'

export const isRangeQuery = selector({
  key: 'isRangeQuery',
  get: ({ get }) => {
    const searchQueryValid = get(store.searchQueryValid)

    return searchQueryValid[0][0].field === 'range'
  },
})
