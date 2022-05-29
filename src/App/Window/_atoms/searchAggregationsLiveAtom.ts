import { selector } from 'recoil';
import type SearchAggregationResponseType from '../../../_types/SearchAggregationResponseType';
import frontendApi from '../_helpers/frontendApi';
import parseSearch from '../_helpers/parseSearch';
import searchStateSerializedAtom from './searchStateSerializedAtom';

const searchAggregationsLiveAtom = selector<SearchAggregationResponseType>({
  key: 'searchAggregationsLiveAtom',
  get: async ({ get }) => {
    const serialized = get(searchStateSerializedAtom);
    const parsed = parseSearch(serialized);

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

export default searchAggregationsLiveAtom;
