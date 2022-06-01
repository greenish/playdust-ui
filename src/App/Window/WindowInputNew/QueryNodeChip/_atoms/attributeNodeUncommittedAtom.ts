import { selector } from 'recoil';
import attributeNodeDeltaAtom from '../../_atoms/attributeNodeDeltaAtom';
import searchQueryActiveNodeAtom from '../../_atoms/searchQueryActiveNodeAtom';
import searchQueryAtom from '../../_atoms/searchQueryAtom';

const attributeNodeUncommittedAtom = selector({
  key: 'attributeNodeUncommittedAtom',
  get: ({ get }) => {
    const activeNode = get(searchQueryActiveNodeAtom);

    if (!activeNode) {
      return null;
    }

    const delta = get(attributeNodeDeltaAtom);

    if (delta.length === 0) {
      return null;
    }

    const { nodes } = get(searchQueryAtom);
    const node = nodes[activeNode.nodeId];
    const isAttributeNode = node.type !== 'group' && node.field === 'attribute';

    if (isAttributeNode) {
      const removals = node.value.filter(
        (option) =>
          !delta.find((d) => d.add === false && d.meta?.value === option)
      );
      const additions = delta
        .filter((entry) => entry.add === true)
        .map((entry) => entry.meta?.value);
      const newValue = [...removals, ...additions];

      return {
        key: node.trait,
        values: newValue,
      };
    }

    return {
      key: delta[0].meta?.key,
      values: delta.map((entry) => entry.meta?.value),
    };
  },
});

export default attributeNodeUncommittedAtom;
