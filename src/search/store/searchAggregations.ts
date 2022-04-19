import { selector } from 'recoil'
import frontendApi from '../../common/helpers/frontendApi'
import { SearchAggregationResponse } from '../types/SearchResponse'
import * as store from './'

export const searchAggregations = selector<SearchAggregationResponse>({
  key: 'searchAggregations',
  get: async ({ get }) => {
    const parsed = get(store.parsedSearchKey)

    if (!parsed) {
      return { attributes: [] }
    }

    const { data } = await frontendApi.post<SearchAggregationResponse>(
      '/search-aggregations',
      parsed
    )

    return data
  },
})
