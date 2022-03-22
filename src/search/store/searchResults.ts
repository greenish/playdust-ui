import {
  atom,
  noWait,
  useRecoilCallback,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from 'recoil'
import api from '../../../helpers/api'
import { fetchSearchResults } from '../helpers/fetchSearchResults'
import AttributeResponse from '../types/AttributeResponse'
import {
  SearchCollectionResponse,
  SearchNFTResponse,
} from '../types/SearchResponse'
import * as store from './'

const routes = {
  nftSearch: '/search-nfts',
  collectionSearch: '/search-collections',
  attributes: '/attributes',
}

export interface SearchResults {
  initialized: boolean
  attributes: AttributeResponse
  collections: SearchCollectionResponse
  nfts: SearchNFTResponse
}

const initialState = {
  initialized: false,
  attributes: [],
  nfts: {
    results: [],
    total: 0,
    cursor: '',
  },
  collections: {
    results: [],
  },
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
    const [
      queryValid,
      sort,
      isCollectionQuery,
      previousController,
      onlyListed,
    ] = await Promise.all([
      snapshot.getPromise(store.searchQueryValid),
      snapshot.getPromise(store.searchSortActual),
      snapshot.getPromise(store.isCollectionQuery),
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

      const nextValue = await fetchSearchResults(
        queryValid,
        sort.value,
        !!onlyListed,
        isCollectionQuery,
        controller
      )

      controllerSetter(undefined)

      setter(nextValue)
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
    const { data } = await api.post<SearchNFTResponse>(routes.nftSearch, {
      cursor: current.nfts.cursor,
    })

    setter((state) => ({
      ...state,
      cursor: data.cursor,
      nfts: {
        ...state.nfts,
        results: [...state.nfts.results, ...data.results],
      },
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
