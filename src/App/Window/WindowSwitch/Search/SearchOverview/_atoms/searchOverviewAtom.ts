import { selector } from 'recoil';
import type SearchOverviewResponseType from '../../../../../../_types/SearchOverviewResponseType';
import searchState from '../../../../_atoms/searchStateAtom';
import frontendApi from '../../../../_helpers/frontendApi';

const searchOverviewAtom = selector<SearchOverviewResponseType>({
  key: 'searchOverviewAtom',
  get: async ({ get }) => {
    const parsed = get(searchState);

    if (!parsed) {
      return {
        listed: 0,
        floor: 0,
        ceiling: 0,
        count: 0,
      };
    }

    const { data } = await frontendApi.post<SearchOverviewResponseType>(
      '/search-overview',
      {
        query: parsed.query,
      }
    );

    return data;
  },
});

export default searchOverviewAtom;
