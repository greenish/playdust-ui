import { atom, selector } from 'recoil'
import type SearchState from '../types/SearchState'
import { searchState } from './searchState'

export const searchStateUncommitted = atom<SearchState>({
  key: 'searchStateUncommitted',
  default: selector({
    key: 'searchStateUncommitted/default',
    get: ({ get }) => {
      return get(searchState)
    },
  }),
})
