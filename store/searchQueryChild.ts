import { selectorFamily } from 'recoil'
import searchQuery, { QueryType } from './searchQuery'

const searchQueryChild = selectorFamily<QueryType, string>({
  key: 'searchQueryChild',
  get:
    (id) =>
    ({ get }) => {
      const query = get(searchQuery)
      const found = query
        .flatMap((parent) => parent)
        .find((child) => child.id === id) as QueryType

      return found
    },
})

export default searchQueryChild
