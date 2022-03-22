import { atom } from 'recoil'

export const searchOnlyListed = atom<boolean | undefined>({
  key: 'searchOnlyListed',
  default: undefined,
})
