import api from '../../../helpers/api'
import type { SearchResults, SearchSortValue } from '../store'
import type AttributeResponse from '../types/AttributeResponse'
import ComposedQueryType from '../types/ComposedQueryType'
import type {
  SearchCollectionResponse,
  SearchNFTResponse,
} from '../types/SearchResponse'

const routes = {
  nftSearch: '/search-nfts',
  collectionSearch: '/search-collections',
  attributes: '/attributes',
}

export const fetchSearchResults = async (
  queryValid: ComposedQueryType,
  sort: SearchSortValue,
  onlyListed: boolean,
  isCollectionQuery: boolean,
  controller: AbortController
): Promise<SearchResults> => {
  const config = { signal: controller.signal }

  const [nftResult, collectionResult, attributeResult] = await Promise.all([
    api.post<SearchNFTResponse>(
      routes.nftSearch,
      {
        query: queryValid,
        sort,
        onlyListed,
      },
      config
    ),
    isCollectionQuery
      ? {
          data: {
            results: [],
          },
        }
      : api.post<SearchCollectionResponse>(
          routes.collectionSearch,
          {
            query: queryValid,
          },
          config
        ),
    api.post<AttributeResponse>(
      routes.attributes,
      {
        query: queryValid,
        onlyListed,
      },
      config
    ),
  ])

  return {
    initialized: true,
    nfts: nftResult.data,
    collections: collectionResult.data,
    attributes: attributeResult.data,
  }
}
