import { noWait, selector } from 'recoil';
import frontendApi from '../../../../../_helpers/frontendApi';
import searchStateSerializedAtom from '../../../../_atoms/searchStateSerializedAtom';
import parseSearch from '../../../../_helpers/parseSearch';
import SearchTopAggResponseType from '../_types/SearchTopAggResponseType';

let previousValue: SearchTopAggResponseType;

const searchTopAggregationsFetchAtom = selector<SearchTopAggResponseType>({
  key: 'searchTopAggregationsFetchAtom',
  get: async ({ get }) => {
    const serialized = get(searchStateSerializedAtom);
    const searchState = parseSearch(serialized);

    if (searchState.query.rootId === '') {
      return {
        attributes: [],
        collections: [],
      };
    }

    const { data } = await frontendApi.post<SearchTopAggResponseType>(
      '/search-top-aggregations',
      searchState
    );

    previousValue = data;

    return data;
  },
});

const searchTopAggregationAtom = selector<SearchTopAggResponseType>({
  key: 'searchTopAggregationFetchAtom',
  get: ({ get }) => {
    if (!previousValue) {
      return get(searchTopAggregationsFetchAtom);
    }

    const loadable = get(noWait(searchTopAggregationsFetchAtom));

    if (loadable.state === 'hasValue') {
      return loadable.contents;
    }

    return previousValue;
  },
});

export default searchTopAggregationAtom;
