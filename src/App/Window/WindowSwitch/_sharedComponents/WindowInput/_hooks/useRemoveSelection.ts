import { useRecoilState, useRecoilValue } from 'recoil';
import searchQueryActiveNodeMetaAtom from '../../../_atoms/searchQueryActiveNodeMetaAtom';
import searchQueryParentIdMapAtom from '../../../_atoms/searchQueryParentIdMapAtom';
import searchStateAtom from '../../../_atoms/searchStateAtom';
import makeUseChangeSearchQuery from '../../../_hooks/makeUseChangeSearchQuery';
import useGetRemoveQueryNode from '../../../_hooks/useGetRemoveQueryNode';
import GroupNodeType from '../../../_types/GroupNodeType';
import searchQueryActiveNodeAtom from '../_atoms/searchQueryActiveNodeAtom';
import searchQuerySelectedNodesAtom from '../_atoms/searchQuerySelectedNodesAtom';

const useRemoveSelection = makeUseChangeSearchQuery(() => {
  const { query } = useRecoilValue(searchStateAtom);
  const selectedNodes = useRecoilValue(searchQuerySelectedNodesAtom);
  const getUseRemoveQuery = useGetRemoveQueryNode();
  const [activeNodeMeta, setActiveNodeMeta] = useRecoilState(
    searchQueryActiveNodeMetaAtom
  );
  const activeNode = useRecoilValue(searchQueryActiveNodeAtom);
  const parentIdMap = useRecoilValue(searchQueryParentIdMapAtom);

  if (!GroupNodeType.is(activeNode) || activeNodeMeta?.type !== 'group') {
    return () => {};
  }

  const parentId = parentIdMap[activeNode.id];
  const parentNode = parentId && query.nodes[parentId];

  return () => {
    setActiveNodeMeta(() => {
      const isActiveGroup = GroupNodeType.is(activeNode);
      const removedAll =
        isActiveGroup &&
        activeNode.children.every((entry) => selectedNodes.includes(entry));

      if (!removedAll) {
        const selectedIndexes = selectedNodes.map((selected) =>
          activeNode.children.findIndex((child) => child === selected)
        );

        return {
          ...activeNodeMeta,
          index: Math.min(...selectedIndexes),
          endIndex: undefined,
          isGroupSelected: undefined,
        };
      }

      if (GroupNodeType.is(parentNode)) {
        return {
          type: 'group',
          nodeId: parentNode.id,
          index: parentNode.children.findIndex(
            (entry) => entry === activeNodeMeta.nodeId
          ),
        };
      }

      return {
        type: 'group',
        index: 0,
        nodeId: query.rootId,
      };
    });

    return getUseRemoveQuery(selectedNodes);
  };
});

export default useRemoveSelection;
