import { atom, selector } from 'recoil'
import parseSearch from '../helpers/parseSearch'

export const searchKey = atom<string>({
  key: 'searchKey',
  default: '',
})

export const parsedSearchKey = selector({
  key: 'parsedSearchKey',
  get: ({ get }) => {
    const key = get(searchKey)

    if (key !== '') {
      const parsed = parseSearch(key)

      return parsed
    }

    return undefined
  },
})
