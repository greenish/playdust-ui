import { selector } from 'recoil'
import type ComposedQueryType from '../../../_types/ComposedQueryType'
import type SearchSortType from '../../../_types/SearchSortType'
import currentState from '../../_atoms/currentState'
import parseSearch from '../_helpers/parseSearch'
import sortOptions from '../_helpers/sortOptions'

export interface SearchStateType {
  query: ComposedQueryType
  sort?: SearchSortType
  onlyListed?: boolean
}

const searchState = selector<SearchStateType>({
  key: 'searchState',
  get: ({ get }) => {
    const current = get(currentState)

    if (!current || current.type !== 'search' || current.state === '') {
      return {
        query: [],
      }
    }

    const result = parseSearch(current.state)
    const withDefaults: SearchStateType = {
      ...result,
      sort: result.sort || sortOptions[0].value,
    }

    return withDefaults
  },
})

export default searchState
