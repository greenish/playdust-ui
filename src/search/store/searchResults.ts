import {
  atom,
  noWait,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from 'recoil'
import { SearchSort } from '.'
import api from '../../../helpers/api'
import AttributeResponse from '../types/AttributeResponse'
import ComposedQueryType from '../types/ComposedQueryType'
import SearchResponse from '../types/SearchResponse'

interface SearchResults extends SearchResponse {
  initialized: boolean
  attributes: AttributeResponse
}

export const searchResults = atom<SearchResults>({
  key: 'searchResult',
  default: {
    initialized: false,
    results: [],
    attributes: [],
    total: 0,
    cursor: '',
  },
})

export const useFetchSearchResults = () => {
  const setter = useSetRecoilState(searchResults)
  const resetter = useResetRecoilState(searchResults)

  return async (queryValid: ComposedQueryType, sort: SearchSort) => {
    resetter()
    const [searchResult, attributeResult] = await Promise.all([
      api.post<SearchResponse>('/search', {
        query: queryValid,
        sort,
      }),
      api.post<AttributeResponse>('/attributes', queryValid),
    ])

    setter({
      initialized: true,
      ...searchResult.data,
      attributes: attributeResult.data,
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
    }))
  }
}

let previousValue: AttributeResponse = []
export const useNoWaitSearchAttributes = () => {
  const loadable = useRecoilValue(noWait(searchResults))

  if (loadable.state === 'hasValue') {
    previousValue = loadable.contents.attributes
  }

  return previousValue
}
