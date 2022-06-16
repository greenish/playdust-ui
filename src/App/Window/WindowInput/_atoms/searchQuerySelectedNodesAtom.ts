import { selector } from 'recoil';
import searchQueryActiveNodeMetaAtom from '../../_atoms/searchQueryActiveNodeMetaAtom';
import searchQueryActiveNodeAtom from './searchQueryActiveNodeAtom';
import searchQuerySelectedNodesRangeAtom from './searchQuerySelectedNodesRangeAtom';

const searchQuerySelectedNodesAtom = selector<string[]>({
  key: 'searchQuerySelectedNodesAtom',
  get: ({ get }) => {
    const activeNode = get(searchQueryActiveNodeAtom);
    const activeNodeMeta = get(searchQueryActiveNodeMetaAtom)
    const range = get(searchQuerySelectedNodesRangeAtom);

    if (!range || activeNode?.type !== 'group') {
      return [];
    }

    if (activeNodeMeta?.type === 'group' && activeNodeMeta.isGroupSelected) {
      return activeNode.children
    }

    return activeNode.children.slice(range[0], range[1]);
  },
});

export default searchQuerySelectedNodesAtom;
