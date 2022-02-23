import { atom, useResetRecoilState, useSetRecoilState } from 'recoil'
import api from '../helpers/api'
import ComposedQueryType from '../types/ComposedQueryType'
import SearchResponse from '../types/SearchResponse'

interface SearchResults extends SearchResponse {
  pageCount: number
  initialized: boolean
}

export const searchResults = atom<SearchResults>({
  key: 'searchResult',
  default: {
    initialized: false,
    results: [],
    total: 0,
    cursor: '',
    pageCount: 0,
  },
})

export const useInitializeSearchResults = () => {
  const setter = useSetRecoilState(searchResults)
  const resetter = useResetRecoilState(searchResults)

  return async (queryValid: ComposedQueryType) => {
    resetter()

    const { data } = await api.post<SearchResponse>('/search', {
      query: queryValid,
    })

    return setter({
      initialized: true,
      pageCount: 1,
      ...data,
    })
  }
}

export const useFetchMoreSearchResults = () => {
  const setter = useSetRecoilState(searchResults)

  return async (current: SearchResults) => {
    const { data } = await api.post<SearchResponse>('/search', {
      cursor: current.cursor,
    })

    setter((state) => ({
      ...state,
      cursor: data.cursor,
      results: [...state.results, ...data.results],
      pageCount: state.pageCount + 1,
    }))
  }
}

export default searchResults
