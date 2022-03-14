import { selector } from 'recoil'
import { searchQueryValid } from '.'

export const isTextQuery = selector<boolean>({
  key: 'isTextQuery',
  get: ({ get }) => {
    const queryValid = get(searchQueryValid)
    const flattened = queryValid.flat()
    const result = flattened.some((child) => child.field === 'text')

    return result
  },
})
