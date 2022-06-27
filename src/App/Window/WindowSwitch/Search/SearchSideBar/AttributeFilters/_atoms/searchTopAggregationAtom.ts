import { noWait, selector } from 'recoil';
import frontendApi from '../../../../../_helpers/frontendApi';
import searchStateAtom from '../../../../_atoms/searchStateAtom';
import SearchAggResponseType from '../../../../_types/SearchAggResponseType';

let previousValue: SearchAggResponseType;

const searchTopAggregationsFetchAtom = selector<SearchAggResponseType>({
  key: 'searchTopAggregationsFetchAtom',
  get: async ({ get }) => {
    const { query } = get(searchStateAtom);

    if (query.rootId === '') {
      return [];
    }

    const { data } = await frontendApi.post<SearchAggResponseType>(
      '/search-top-aggregations',
      {
        query,
      }
    );

    previousValue = data;

    return data;
  },
});

const searchTopAggregationAtom = selector<SearchAggResponseType>({
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
