import {
  atom,
  noWait,
  useRecoilCallback,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from 'recoil'
import api from '../../../helpers/api'
import {
  AttributeResponse,
  SearchCursorResponse,
  SearchResponse,
} from '../types/SearchResponse'
import * as store from './'

export interface SearchResults extends SearchResponse {
  initialized: boolean
}

const initialState = {
  initialized: false,
  attributes: [],
  total: 0,
  cursor: '',
  nfts: [],
  collections: [],
}

export const searchResults = atom<SearchResults>({
  key: 'searchResult',
  default: initialState,
})

export const useFetchSearchResults = () => {
  const setter = useSetRecoilState(searchResults)
  const resetter = useResetRecoilState(searchResults)
  const controllerSetter = useSetRecoilState(store.searchResultsController)

  return useRecoilCallback(({ snapshot }) => async () => {
    const [queryValid, sort, previousController, onlyListed] =
      await Promise.all([
        snapshot.getPromise(store.searchQueryValid),
        snapshot.getPromise(store.searchSortActual),
        snapshot.getPromise(store.searchResultsController),
        snapshot.getPromise(store.searchOnlyListed),
      ])

    if (previousController) {
      previousController.abort()
    }

    try {
      resetter()
      const controller = new AbortController()
      controllerSetter(controller)

      const { data } = await api.post<SearchResponse>(
        '/search',
        {
          query: queryValid,
          sort: sort.value,
          onlyListed,
        },
        { signal: controller.signal }
      )

      controllerSetter(undefined)

      setter({
        initialized: true,
        ...data,
      })
    } catch (err: any) {
      if (err.message !== 'canceled') {
        console.error(err)
      }
    }
  })
}

export const useFetchMoreSearchResults = () => {
  const setter = useSetRecoilState(searchResults)

  return async (current: SearchResults) => {
    const { data } = await api.post<SearchCursorResponse>('/search-cursor', {
      cursor: current.cursor,
    })

    setter((state) => ({
      ...state,
      cursor: data.cursor,
      nfts: [...state.nfts, ...data.nfts],
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
