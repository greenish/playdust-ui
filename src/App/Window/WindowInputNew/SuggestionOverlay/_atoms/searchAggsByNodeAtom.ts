import { selector } from 'recoil';
import SearchAggResponseType from '../../../../../_types/SearchAggResponseType';
import frontendApi from '../../../_helpers/frontendApi';
import searchQueryActiveNodeAtom from '../../_atoms/searchQueryActiveNodeAtom';
import searchQueryAtom from '../../_atoms/searchQueryAtom';

const searchAggsByNodeAtom = selector<SearchAggResponseType | null>({
  key: 'searchAggsByNodeAtom',
  get: async ({ get }) => {
    const query = get(searchQueryAtom);
    const activeNode = get(searchQueryActiveNodeAtom);

    if (!activeNode) {
      return null;
    }

    const { data } = await frontendApi.post<SearchAggResponseType>(
      '/search-aggregations-new',
      {
        query,
        activeNodeId: activeNode.nodeId,
      }
    );

    return data;
  },
});

export default searchAggsByNodeAtom;
