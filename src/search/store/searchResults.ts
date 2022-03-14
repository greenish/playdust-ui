import {
  atom,
  noWait,
  useRecoilCallback,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from 'recoil'
import { isCollectionQuery, SearchSort } from '.'
import api from '../../../helpers/api'
import AttributeResponse from '../types/AttributeResponse'
import ComposedQueryType from '../types/ComposedQueryType'
import {
  SearchCollectionResponse,
  SearchNFTResponse,
} from '../types/SearchResponse'

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

  return useRecoilCallback(
    ({ snapshot }) =>
      async (queryValid: ComposedQueryType, sort: SearchSort) => {
        const isCollectionQueryValue = await snapshot.getPromise(
          isCollectionQuery
        )
        resetter()

        const [nftResult, collectionResult, attributeResult] =
          await Promise.all([
            api.post<SearchNFTResponse>(routes.nftSearch, {
              query: queryValid,
              sort,
            }),
            isCollectionQueryValue
              ? { data: initialState.collections }
              : api.post<SearchCollectionResponse>(routes.collectionSearch, {
                  query: queryValid,
                }),
            api.post<AttributeResponse>(routes.attributes, queryValid),
          ])

        setter({
          initialized: true,
          nfts: nftResult.data,
          collections: collectionResult.data,
          attributes: attributeResult.data,
        })
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
