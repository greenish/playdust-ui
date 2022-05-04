import { atom, selector } from 'recoil'
import type { SearchStateType } from './searchState'
import searchState from './searchState'

const searchStateUncommitted = atom<SearchStateType>({
  key: 'searchStateUncommitted',
  default: selector({
    key: 'searchStateUncommitted/default',
    get: ({ get }) => {
      return get(searchState)
    },
  }),
})

export default searchStateUncommitted
