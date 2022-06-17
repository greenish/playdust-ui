import { useCallback } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import shortId from '../../../_helpers/shortId';
import searchQueryActiveNodeMetaAtom from '../../_atoms/searchQueryActiveNodeMetaAtom';
import searchQueryRootNodeAtom from '../../_atoms/searchQueryRootNodeAtom';
import searchStateAtom from '../../_atoms/searchStateAtom';
import insertAtIdx from '../../_helpers/insertAtIdx';
import makeUseChangeSearchQuery from '../../_hooks/makeUseChangeSearchQuery';
import useGetUpdateSearchQuery from '../../_hooks/useGetUpdateSearchQuery';
import GroupNodeType from '../../_types/GroupNodeType';
import SearchQueryType from '../../_types/SearchQueryType';
import searchQueryActiveNodeAtom from '../_atoms/searchQueryActiveNodeAtom';
import searchQuerySelectedNodesRangeAtom from '../_atoms/searchQuerySelectedNodesRangeAtom';

const useAddGroupQueryNode = makeUseChangeSearchQuery(() => {
  const setActiveNodeMeta = useSetRecoilState(searchQueryActiveNodeMetaAtom);
  const activeNode = useRecoilValue(searchQueryActiveNodeAtom);
  const rootNode = useRecoilValue(searchQueryRootNodeAtom);
  const { query } = useRecoilValue(searchStateAtom);
  const getUpdateSearchQuery = useGetUpdateSearchQuery();
  const selectionRange = useRecoilValue(searchQuerySelectedNodesRangeAtom);

  const getNextState = useCallback(
    (newId: string): { query: SearchQueryType; index: number } | null => {
      if (!selectionRange || activeNode?.type !== 'group') {
        return null;
      }

      const operator = activeNode.operator === 'and' ? 'or' : 'and';

      const [startIdx, endIdx] = selectionRange;

      const isRootNode = activeNode.id === rootNode?.id;
      const newNodeChildren = activeNode.children.slice(startIdx, endIdx);
      const updatedChildren = activeNode.children.filter(
        (entry) => !newNodeChildren.includes(entry)
      );

      if (updatedChildren.length) {
        const newNode: GroupNodeType = {
          id: newId,
          type: 'group',
          operator,
          children: newNodeChildren,
        };

        const updatedActiveNode: GroupNodeType = {
          ...activeNode,
          children: insertAtIdx(updatedChildren, newNode.id, startIdx),
        };

        const updatedQuery = {
          ...query,
          nodes: {
            ...query.nodes,
            [updatedActiveNode.id]: updatedActiveNode,
            [newNode.id]: newNode,
          },
        };

        return {
          query: updatedQuery,
          index: newNode.children.length,
        };
      }

      const newNode: GroupNodeType = {
        id: newId,
        type: 'group',
        operator,
        children: [activeNode.id],
      };

      if (isRootNode) {
        const updatedQuery = {
          rootId: newNode.id,
          nodes: {
            [newNode.id]: newNode,
            ...query.nodes,
          },
        };

        return {
          query: updatedQuery,
          index: 1,
        };
      }

      const updated = getUpdateSearchQuery((node) => {
        if (node.type === 'group' && node.id !== newNode.id) {
          return {
            ...node,
            children: node.children.map((child) => {
              if (child === activeNode.id) {
                return newNode.id;
              }

              return child;
            }),
          };
        }

        return node;
      }, newNode);

      return {
        query: updated.query,
        index: 1,
      };
    },
    [activeNode, getUpdateSearchQuery, query, rootNode?.id, selectionRange]
  );

  return () => {
    const newId = shortId();
    const nextState = getNextState(newId);

    if (!nextState) {
      return;
    }

    setActiveNodeMeta({
      nodeId: newId,
      type: 'group',
      index: nextState.index,
    });

    return { query: nextState.query };
  };
});

export default useAddGroupQueryNode;
