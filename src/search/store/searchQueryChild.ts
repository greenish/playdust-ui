import { selectorFamily } from 'recoil'
import type { QueryType } from '../types/ComposedQueryType'
import { searchStateUncommitted } from './'

export const searchQueryChild = selectorFamily<QueryType, string>({
  key: 'searchQueryChild',
  get:
    (id) =>
    ({ get }) => {
      const { query } = get(searchStateUncommitted)
      const found = query
        .flatMap((parent) => parent)
        .find((child) => child.id === id) as QueryType

      return found
    },
})
