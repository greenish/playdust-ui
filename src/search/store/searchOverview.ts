import { selector } from 'recoil'
import frontendApi from '../../common/helpers/frontendApi'
import parseSearch from '../helpers/parseSearch'
import { SearchOverviewResponse } from '../types/SearchResponse'
import * as store from './'

export const searchOverview = selector<SearchOverviewResponse>({
  key: 'searchOverview',
  get: async ({ get }) => {
    const key = get(store.searchKey)
    const { query } = parseSearch(key)

    const { data } = await frontendApi.post<SearchOverviewResponse>(
      '/search-overview',
      {
        query,
      }
    )

    return data
  },
})
