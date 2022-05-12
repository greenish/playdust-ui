import { selector } from 'recoil';
import type SearchAggregationResponseType from '../../../_types/SearchAggregationResponseType';
import frontendApi from '../_helpers/frontendApi';
import searchState from './searchStateAtom';

const searchAggregationsAtom = selector<SearchAggregationResponseType>({
  key: 'searchAggregationsAtom',
  get: async ({ get }) => {
    const parsed = get(searchState);

    if (!parsed) {
      return { attributes: [] };
    }

    const { data } = await frontendApi.post<SearchAggregationResponseType>(
      '/search-aggregations',
      parsed
    );

    return data;
  },
});

export default searchAggregationsAtom;
