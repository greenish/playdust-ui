import { nanoid } from 'nanoid'
import {
  atom,
  selector,
  useRecoilValueLoadable,
  useSetRecoilState,
} from 'recoil'
import api from '../../common/helpers/frontendApi'
import { SearchCursorResponse, SearchResponse } from '../types/SearchResponse'
import * as store from './'

const initialState = {
  total: 0,
  cursor: '',
  nfts: [],
}

const searchResultsBase = selector<SearchResponse>({
  key: 'searchResultsBase',
  get: async ({ get }) => {
    try {
      const parsed = get(store.searchState)

      if (!parsed || parsed.query.length === 0) {
        return initialState
      }

      if (parsed.query.length === 0) {
        return initialState
      }

      const cleaned = {
        ...parsed,
        query: parsed.query.map((parent) =>
          parent.map((child) => ({
            ...child,
            id: nanoid(),
          }))
        ),
      }

      const { data } = await api.post<SearchResponse>('/search', cleaned)

      return data
    } catch (err: any) {
      if (err.message !== 'canceled') {
        console.error(err)
      }

      return initialState
    }
  },
})

const searchResultsMore = atom<SearchResponse['nfts']>({
  key: 'searchResultsMore',
  default: [],
})

export const searchResults = selector<SearchResponse>({
  key: 'searchResults',
  get: ({ get }) => {
    const base = get(searchResultsBase)
    const more = get(searchResultsMore)

    return {
      ...base,
      nfts: [...base.nfts, ...more],
    }
  },
})

export const useFetchMoreSearchResults = () => {
  const loadable = useRecoilValueLoadable(searchResults)
  const setter = useSetRecoilState(searchResultsMore)

  return async () => {
    if (loadable.state === 'hasValue') {
      const { cursor } = loadable.contents

      const { data } = await api.post<SearchCursorResponse>('/search-cursor', {
        cursor,
      })

      setter((curr) => [...curr, ...data.nfts])
    }
  }
}
