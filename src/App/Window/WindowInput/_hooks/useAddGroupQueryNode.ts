import { nanoid } from 'nanoid';
import { useCallback } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import searchQueryActiveGroupIdxAtom from '../../_atoms/searchQueryActiveGroupIdxAtom';
import searchQueryActiveNodeAtom from '../../_atoms/searchQueryActiveNodeAtom';
import searchQueryActiveNodeMetaAtom from '../../_atoms/searchQueryActiveNodeMetaAtom';
import searchQueryRootNodeAtom from '../../_atoms/searchQueryRootNodeAtom';
import searchStateAtom from '../../_atoms/searchStateAtom';
import insertAtIdx from '../../_helpers/insertAtIdx';
import reduceSearchQuery from '../../_helpers/reduceSearchQuery';
import useChangeSearchQuery from '../../_hooks/useChangeSearchQuery';
import GroupNodeType from '../../_types/GroupNodeType';

const useAddGroupQueryNode = () => {
  const setActiveNodeMeta = useSetRecoilState(searchQueryActiveNodeMetaAtom);
  const activeNode = useRecoilValue(searchQueryActiveNodeAtom);
  const activeGroupIdx = useRecoilValue(searchQueryActiveGroupIdxAtom);
  const rootNode = useRecoilValue(searchQueryRootNodeAtom);
  const { query } = useRecoilValue(searchStateAtom);
  const changeSearchQuery = useChangeSearchQuery();

  const getNextState = useCallback(
    (operator: GroupNodeType['operator'], endIdx: number, newId: string) => {
      if (activeNode?.type !== 'group') {
        return null;
      }

      const isRootNode = activeNode.id === rootNode?.id;
      const newNodeChildren = activeNode.children.slice(activeGroupIdx, endIdx);
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
          children: insertAtIdx(updatedChildren, newNode.id, activeGroupIdx),
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

      const baseUpdatedQuery = {
        ...query,
        nodes: {
          ...query.nodes,
          [newNode.id]: newNode,
        },
      };

      const updatedQuery = reduceSearchQuery(baseUpdatedQuery, (node) => {
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
      });

      return {
        query: updatedQuery,
        index: 1,
      };
    },
    [activeGroupIdx, activeNode, query, rootNode?.id]
  );

  return (operator: GroupNodeType['operator'], endIdx: number) => {
    const newId = nanoid();
    const nextState = getNextState(operator, endIdx, newId);

    if (!nextState) {
      return;
    }

    changeSearchQuery({ query: nextState.query });
    setActiveNodeMeta({
      nodeId: newId,
      type: 'group',
      index: nextState.index,
    });
  };
};

export default useAddGroupQueryNode;
