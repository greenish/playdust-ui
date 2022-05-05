import { selector } from 'recoil';
import type SearchAggregationResponseType from '../../../_types/SearchAggregationResponseType';
import frontendApi from '../../_helpers/frontendApi';
import searchState from './searchState';

const searchAggregations = selector<SearchAggregationResponseType>({
  key: 'searchAggregations',
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

export default searchAggregations;
