import { selectorFamily } from 'recoil'
import * as store from '.'
import { RangeQuery } from '../types/ComposedQueryType'

export const rangeQueryByName = selectorFamily<RangeQuery | undefined, string>({
  key: 'rangeQueryByName',
  get:
    (name: string) =>
    ({ get }) => {
      const query = get(store.searchQueryValid)
      const flat = query.flat()
      const found = flat.find(
        (child) => child.field === 'range' && child.value === name
      )

      if (found) {
        return found as RangeQuery
      }

      return found
    },
})
