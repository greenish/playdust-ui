import { selector } from 'recoil'
import frontendApi from '../../App/_helpers/frontendApi'
import { SearchOverviewResponse } from '../types/SearchResponse'
import * as store from './'

export const searchOverview = selector<SearchOverviewResponse>({
  key: 'searchOverview',
  get: async ({ get }) => {
    const parsed = get(store.searchState)

    if (!parsed) {
      return {
        listed: 0,
        floor: 0,
        ceiling: 0,
        count: 0,
      }
    }

    const { data } = await frontendApi.post<SearchOverviewResponse>(
      '/search-overview',
      {
        query: parsed.query,
      }
    )

    return data
  },
})
