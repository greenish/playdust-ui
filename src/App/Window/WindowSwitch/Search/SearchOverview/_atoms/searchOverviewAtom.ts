import { selector } from 'recoil';
import type SearchOverviewResponseType from '../../../../../../_types/SearchOverviewResponseType';
import searchStateSerializedAtom from '../../../../_atoms/searchStateSerializedAtom';
import frontendApi from '../../../../_helpers/frontendApi';
import parseSearch from '../../../../_helpers/parseSearch';

const searchOverviewAtom = selector<SearchOverviewResponseType>({
  key: 'searchOverviewAtom',
  get: async ({ get }) => {
    const serialized = get(searchStateSerializedAtom);
    const parsed = parseSearch(serialized);

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
