import { selector } from 'recoil'
import type SearchOverviewResponseType from '../../../../../_types/SearchOverviewResponseType'
import frontendApi from '../../../../_helpers/frontendApi'
import searchState from '../../../_atoms/searchState'

const searchOverview = selector<SearchOverviewResponseType>({
  key: 'searchOverview',
  get: async ({ get }) => {
    const parsed = get(searchState)

    if (!parsed) {
      return {
        listed: 0,
        floor: 0,
        ceiling: 0,
        count: 0,
      }
    }

    const { data } = await frontendApi.post<SearchOverviewResponseType>(
      '/search-overview',
      {
        query: parsed.query,
      }
    )

    return data
  },
})

export default searchOverview
