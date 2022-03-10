import { selectorFamily } from 'recoil'
import { searchQueryAttributes } from './'

export const searchQueryAttribute = selectorFamily({
  key: 'searchQueryAttribute',
  get:
    (id) =>
    ({ get }) => {
      const attributes = get(searchQueryAttributes)
      const result = attributes.find((entry) => entry.id === id)!

      return result
    },
})
