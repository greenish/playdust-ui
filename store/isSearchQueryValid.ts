import { selector } from 'recoil'
import searchQuery from './searchQuery'

const isSearchQueryValid = selector<boolean>({
  key: 'isSearchQueryValid',
  get: ({ get }) => {
    const flattened = get(searchQuery).flat()

    const result = flattened.every((entry) => {
      if ('trait' in entry && entry.trait === '') {
        return false
      }

      const { value } = entry

      if (value === '') {
        return false
      }

      if (Array.isArray(value) && value.length === 0) {
        return false
      }

      return true
    })

    return result
  },
})

export default isSearchQueryValid
