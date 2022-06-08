import { selector } from 'recoil';
import { assert } from 'superstruct';
import GroupNodeType from '../_types/GroupNodeType';
import searchStateAtom from './searchStateAtom';

const searchQueryRootNodeAtom = selector<GroupNodeType | null>({
  key: 'searchQueryRootNodeAtom',
  get: ({ get }) => {
    const { rootId, nodes } = get(searchStateAtom).query;

    if (Object.values(nodes).length === 0) {
      return null;
    }

    const rootNode = nodes[rootId];

    assert(rootNode, GroupNodeType);
    return rootNode;
  },
});
export default searchQueryRootNodeAtom;
