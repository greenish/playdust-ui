import { selector } from 'recoil'
import * as store from './'

export const searchQueryNoRanges = selector({
  key: 'searchQueryNoRanges',
  get: ({ get }) => {
    const query = get(store.searchQueryValid)
    const result = query.filter((entry) => entry[0].field !== 'range')

    return result
  },
})
