import { selector } from 'recoil'
import searchQueryValid from './searchQueryValid'

const searchQueryNoRanges = selector({
  key: 'searchQueryNoRanges',
  get: ({ get }) => {
    const query = get(searchQueryValid)
    const result = query.filter((entry) => entry[0].field !== 'range')

    return result
  },
})

export default searchQueryNoRanges
