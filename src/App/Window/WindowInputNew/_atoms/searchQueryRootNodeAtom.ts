import { selector } from 'recoil';
import { assert } from 'superstruct';
import GroupNodeType from '../_types/GroupNodeType';
import searchQueryAtom from './searchQueryAtom';

const searchQueryNodeAtom = selector<GroupNodeType>({
  key: 'searchQueryNodeAtom',
  get: ({ get }) => {
    const { rootId, nodes } = get(searchQueryAtom);
    const rootNode = nodes[rootId];
    assert(rootNode, GroupNodeType);
    return rootNode;
  },
});
export default searchQueryNodeAtom;
