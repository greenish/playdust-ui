import {
  atom,
  noWait,
  useRecoilCallback,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from 'recoil'
import api from '../../../helpers/api'
import AttributeResponse from '../types/AttributeResponse'
import ComposedQueryType from '../types/ComposedQueryType'
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

interface SearchResults {
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

  return useRecoilCallback(
    ({ snapshot }) =>
      async (queryValid: ComposedQueryType, sort: store.SearchSortValue) => {
        const isCollectionQueryValue = await snapshot.getPromise(
          store.isCollectionQuery
        )
        const previousController = await snapshot.getPromise(
          store.searchResultsController
        )
        resetter()

        if (previousController) {
          previousController.abort()
        }

        const controller = new AbortController()
        controllerSetter(controller)
        const config = { signal: controller.signal }

        try {
          const [nftResult, collectionResult, attributeResult] =
            await Promise.all([
              api.post<SearchNFTResponse>(
                routes.nftSearch,
                {
                  query: queryValid,
                  sort,
                },
                config
              ),
              isCollectionQueryValue
                ? { data: initialState.collections }
                : api.post<SearchCollectionResponse>(
                    routes.collectionSearch,
                    {
                      query: queryValid,
                    },
                    config
                  ),
              api.post<AttributeResponse>(
                routes.attributes,
                queryValid,
                config
              ),
            ])

          controllerSetter(undefined)

          setter({
            initialized: true,
            nfts: nftResult.data,
            collections: collectionResult.data,
            attributes: attributeResult.data,
          })
        } catch (err: any) {
          if (err.message !== 'canceled') {
            console.error(err)
          }
        }
      }
  )
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
