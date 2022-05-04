import { selectorFamily } from 'recoil'
import type RangeQueryNodeType from '../../../../../_types/RangeQueryNodeType'
import searchQueryValid from '../../../_atoms/searchQueryValid'

const rangeQueryByName = selectorFamily<RangeQueryNodeType | undefined, string>(
  {
    key: 'rangeQueryByName',
    get:
      (name: string) =>
      ({ get }) => {
        const query = get(searchQueryValid)
        const flat = query.flat()
        const found = flat.find(
          (child) => child.field === 'range' && child.value === name
        )

        if (found) {
          return found as RangeQueryNodeType
        }

        return found
      },
  }
)

export default rangeQueryByName
