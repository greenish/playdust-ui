import { atom } from 'recoil'

export const searchResultsController = atom<AbortController | undefined>({
  key: 'searchResultsController',
  default: undefined,
})
