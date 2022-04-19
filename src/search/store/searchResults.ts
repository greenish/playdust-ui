import { nanoid } from 'nanoid'
import {
  atom,
  noWait,
  selector,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil'
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

export const searchResults = selector<SearchResponse>({
  key: 'searchResults',
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
})

export const moreSearchResults = atom<SearchResponse['nfts']>({
  key: 'moreSearchResults',
  default: [],
})

export const allSearchResults = selector<SearchResponse>({
  key: 'allSearchResults',
  get: ({ get }) => {
    const results = get(searchResults)
    const more = get(moreSearchResults)

    return {
      ...results,
      nfts: [...results.nfts, ...more],
    }
  },
})

export const useFetchMoreSearchResults = () => {
  const { cursor } = useRecoilValue(searchResults)
  const setter = useSetRecoilState(moreSearchResults)

  return async () => {
    const { data } = await api.post<SearchCursorResponse>('/search-cursor', {
      cursor,
    })

    setter((curr) => [...curr, ...data.nfts])
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
