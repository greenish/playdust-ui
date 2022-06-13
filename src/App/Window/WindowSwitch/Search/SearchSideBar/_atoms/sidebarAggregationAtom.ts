import { selector } from 'recoil';
import SearchAggResponseType from '../../../../WindowInput/_types/SearchAggResponseType';
import searchStateAtom from '../../../../_atoms/searchStateAtom';
import frontendApi from '../../../../_helpers/frontendApi';
import CollectionQueryNodeType from '../../../../_types/CollectionQueryNodeType';

const delimiter = ',';

const activeCollectionIdsStringAtom = selector<string>({
  key: 'activeCollectionIdsAtom',
  get: ({ get }) => {
    const { query } = get(searchStateAtom);

    const collectionIds = Object.values(query.nodes)
      .map((entry) => (CollectionQueryNodeType.is(entry) ? entry.value : ''))
      .filter((entry) => entry !== '')
      .sort();

    return collectionIds.join(delimiter);
  },
});

const sidebarAggregationAtom = selector<SearchAggResponseType>({
  key: 'sidebarAggregationAtom',
  get: async ({ get }) => {
    const collectionIdsString = get(activeCollectionIdsStringAtom);

    const { data } = await frontendApi.post<SearchAggResponseType>(
      '/sidebar-aggregations',
      {
        collectionIds: collectionIdsString.split(delimiter),
      }
    );

    return data;
  },
});

export default sidebarAggregationAtom;
