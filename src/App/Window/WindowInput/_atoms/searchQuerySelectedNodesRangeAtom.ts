import { selector } from 'recoil';
import searchQueryActiveNodeMetaAtom from '../../_atoms/searchQueryActiveNodeMetaAtom';
import searchQueryActiveNodeAtom from './searchQueryActiveNodeAtom';

const searchQuerySelectedNodesRangeAtom = selector<[number, number] | null>({
  key: 'searchQuerySelectedNodesRangeAtom',
  get: ({ get }) => {
    const activeNodeMeta = get(searchQueryActiveNodeMetaAtom);
    const activeNode = get(searchQueryActiveNodeAtom);

    if (
      !(
        activeNode?.type === 'group' &&
        activeNodeMeta?.type === 'group' &&
        activeNodeMeta.endIndex !== undefined
      )
    ) {
      return null;
    }

    const { index, endIndex } = activeNodeMeta;
    const range: [number, number] = [
      Math.min(index, endIndex),
      Math.max(index, endIndex),
    ];

    return range;
  },
});

export default searchQuerySelectedNodesRangeAtom;
