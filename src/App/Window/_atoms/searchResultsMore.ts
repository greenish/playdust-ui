import { atom } from 'recoil'
import type SearchResponseType from '../../../_types/SearchResponseType'

const searchResultsMore = atom<SearchResponseType['nfts']>({
  key: 'searchResultsMore',
  default: [],
})

export default searchResultsMore
