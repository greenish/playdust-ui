import { selector } from 'recoil'
import type SearchResponseType from '../../../_types/SearchResponseType'
import searchResultsBase from './searchResultsBase'
import searchResultsMore from './searchResultsMore'

const searchResults = selector<SearchResponseType>({
  key: 'searchResults',
  get: ({ get }) => {
    const base = get(searchResultsBase)
    const more = get(searchResultsMore)

    return {
      ...base,
      nfts: [...base.nfts, ...more],
    }
  },
})

export default searchResults
