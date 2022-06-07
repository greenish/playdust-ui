import { selector } from 'recoil';
import SearchQueryNodeType from '../_types/SearchQueryNodeType';
import searchQueryActiveNodeMetaAtom from './searchQueryActiveNodeMetaAtom';
import searchStateAtom from './searchStateAtom';

const searchQueryActiveNodeAtom = selector<SearchQueryNodeType | null>({
  key: 'searchQueryActiveNodeAtom',
  get: ({ get }) => {
    const meta = get(searchQueryActiveNodeMetaAtom);

    if (!meta) {
      return null;
    }

    const { nodes } = get(searchStateAtom).query;

    return nodes[meta.nodeId];
  },
});

export default searchQueryActiveNodeAtom;
