import { selector } from 'recoil'
import currentState from '../../App/_atoms/currentState'
import parseSearch from '../helpers/parseSearch'
import sortOptions from '../helpers/sortOptions'
import SearchState from '../types/SearchState'

export const searchState = selector<SearchState>({
  key: 'searchState',
  get: ({ get }) => {
    const current = get(currentState)

    if (!current || current.type !== 'search' || current.state === '') {
      return {
        query: [],
      }
    }

    const result = parseSearch(current.state)
    const withDefaults: SearchState = {
      ...result,
      sort: result.sort || sortOptions[0].value,
    }

    return withDefaults
  },
})
