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

export const searchResults = selector<SearchResponse>({
  key: 'searchResults',
  get: async ({ get }) => {
    try {
      const parsed = get(store.parsedSearchKey)

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

export const searchResultsAll = selector<SearchResponse>({
  key: 'searchResultsAll',
  get: ({ get }) => {
    const results = get(searchResults)
    const more = get(searchResultsMore)

    return {
      ...results,
      nfts: [...results.nfts, ...more],
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
