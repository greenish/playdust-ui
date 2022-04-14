import { nanoid } from 'nanoid'
import { atom, noWait, selector, useRecoilState, useRecoilValue } from 'recoil'
import api from '../../common/helpers/frontendApi'
import parseSearch from '../helpers/parseSearch'
import {
  AttributeResponse,
  SearchCursorResponse,
  SearchResponse,
} from '../types/SearchResponse'

const initialState = {
  attributes: [],
  total: 0,
  cursor: '',
  nfts: [],
  collections: [],
}

export const searchKey = atom<string>({
  key: 'searchKey',
  default: '',
})

export const searchResults = atom<SearchResponse>({
  key: 'searchResults',
  default: selector<SearchResponse>({
    key: 'searchResults/default',
    get: async ({ get }) => {
      const key = get(searchKey)

      if (key === '') {
        return initialState
      }

      try {
        const parsed = parseSearch(key)

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
  }),
})

export const useFetchMoreSearchResults = () => {
  const [current, setter] = useRecoilState(searchResults)

  return async () => {
    const { data } = await api.post<SearchCursorResponse>('/search-cursor', {
      cursor: current.cursor,
    })

    setter({
      ...current,
      cursor: data.cursor,
      nfts: [...current.nfts, ...data.nfts],
    })
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
