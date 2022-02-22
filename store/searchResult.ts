import { noWait, selector, useRecoilValue } from 'recoil'
import api from '../helpers/api'
import SearchResponse from '../types/SearchResponse'
import searchQueryValid from './searchQueryValid'

const searchResult = selector<SearchResponse>({
  key: 'searchResult',
  get: async ({ get }) => {
    const query = get(searchQueryValid)

    const { data } = await api.post<SearchResponse>('/search', query)

    return data
  },
})

interface LoadableSearchResponse extends SearchResponse {
  initialized: boolean
}

export const useNoWaitSearchResult = (): LoadableSearchResponse => {
  const value = useRecoilValue(noWait(searchResult))

  if (value.state === 'hasValue') {
    return {
      initialized: true,
      ...value.contents,
    }
  }

  return {
    initialized: false,
    total: 0,
    results: [],
  }
}

export default searchResult
