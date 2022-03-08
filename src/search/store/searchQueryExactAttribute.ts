import { selectorFamily } from 'recoil'
import { searchQueryExactAttributes } from './'

export const searchQueryExactAttribute = selectorFamily({
  key: 'searchQueryExactAttribute',
  get:
    (id) =>
    ({ get }) => {
      const exactAttributes = get(searchQueryExactAttributes)
      const result = exactAttributes.find((entry) => entry.id === id)!

      return result
    },
})
