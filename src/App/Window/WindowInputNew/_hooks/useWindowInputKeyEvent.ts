import { useCallback } from 'react';
import { useEvent } from 'react-use';
import { useRecoilState, useRecoilValue } from 'recoil';
import { is } from 'superstruct';
import searchQueryActiveNodeAtom from '../_atoms/searchQueryActiveNodeAtom';
import searchQueryAtom from '../_atoms/searchQueryAtom';
import searchQueryParentIdMapAtom from '../_atoms/searchQueryParentIdMapAtom';
import searchQueryRootNodeAtom from '../_atoms/searchQueryRootNodeAtom';
import searchQueryTermAtom from '../_atoms/searchQueryTermAtom';
import GroupNodeType from '../_types/GroupNodeType';
import SearchQueryNodeType from '../_types/SearchQueryNodeType';

const useWindowInputKeyEvent = () => {
  const [activeNode, setActiveNode] = useRecoilState(searchQueryActiveNodeAtom);
  const [searchTerm] = useRecoilState(searchQueryTermAtom);
  const parentIdMap = useRecoilValue(searchQueryParentIdMapAtom);
  const searchQuery = useRecoilValue(searchQueryAtom);
  const rootNode = useRecoilValue(searchQueryRootNodeAtom);

  const onKeyDown = useCallback(
    (evt: KeyboardEvent) => {
      if (!activeNode || searchTerm !== '') {
        return;
      }
      const node = searchQuery.nodes[activeNode.nodeId];
      const parentId = parentIdMap[activeNode.nodeId];
      const parent: SearchQueryNodeType | null = parentId
        ? searchQuery.nodes[parentId] ?? null
        : null;

      if (!node) {
        return;
      }

      switch (evt.key) {
        case 'ArrowLeft': {
          if (activeNode.type === 'query' && is(parent, GroupNodeType)) {
            const newPosition = parent.children.findIndex(
              (nodeId) => nodeId === activeNode.nodeId
            );
            setActiveNode({
              type: 'group',
              index: newPosition,
              nodeId: parent.id,
            });
          }
          if (activeNode.type === 'group' && is(node, GroupNodeType)) {
            let newIndex = Math.max(activeNode.index - 1, 0);
            let newNodeId = activeNode.nodeId;

            const nextNode =
              activeNode.index > 0 &&
              searchQuery.nodes[node.children[newIndex]];

            // move to start of current group
            if (evt.metaKey) {
              setActiveNode({ type: 'group', index: 0, nodeId: rootNode.id });
              return;
            }
            // move ontop of next query/pill
            if (evt.shiftKey && nextNode && !is(nextNode, GroupNodeType)) {
              setActiveNode({ type: 'query', nodeId: nextNode.id });
              return;
            }
            // move into next group.
            if (
              !evt.altKey &&
              nextNode &&
              nextNode !== node &&
              is(nextNode, GroupNodeType)
            ) {
              newIndex = nextNode.children.length;
              newNodeId = nextNode.id;
            }
            // move out of current group.
            if (
              !evt.altKey &&
              activeNode.index === 0 &&
              is(parent, GroupNodeType)
            ) {
              newIndex = parent.children.findIndex(
                (nodeId) => nodeId === activeNode.nodeId
              );
              newNodeId = parent.id;
            }

            setActiveNode({
              type: 'group',
              index: newIndex,
              nodeId: newNodeId,
            });
          }
          break;
        }
        case 'ArrowRight': {
          if (activeNode.type === 'query' && is(parent, GroupNodeType)) {
            const newPosition =
              parent.children.findIndex(
                (nodeId) => nodeId === activeNode.nodeId
              ) + 1;
            setActiveNode({
              type: 'group',
              index: newPosition,
              nodeId: parent.id,
            });
          }
          if (activeNode.type === 'group' && is(node, GroupNodeType)) {
            let newIndex = Math.min(activeNode.index + 1, node.children.length);
            let newNodeId = activeNode.nodeId;

            const nextNode =
              activeNode.index < node.children.length &&
              searchQuery.nodes[node.children[activeNode.index]];

            // move to end of current group
            if (evt.metaKey) {
              setActiveNode({
                type: 'group',
                index: rootNode.children.length,
                nodeId: rootNode.id,
              });
              return;
            }
            // move ontop of next query/pill
            if (evt.shiftKey && nextNode && !is(nextNode, GroupNodeType)) {
              setActiveNode({ type: 'query', nodeId: nextNode.id });
              return;
            }
            // move into next group.
            if (!evt.altKey && nextNode && is(nextNode, GroupNodeType)) {
              newIndex = 0;
              newNodeId = nextNode.id;
            }
            // move out of current group.
            if (
              !evt.altKey &&
              activeNode.index === node.children.length &&
              is(parent, GroupNodeType)
            ) {
              newIndex =
                parent.children.findIndex(
                  (nodeId) => nodeId === activeNode.nodeId
                ) + 1;
              newNodeId = parent.id;
            }

            setActiveNode({
              type: 'group',
              index: newIndex,
              nodeId: newNodeId,
            });
          }
          break;
        }
        default:
      }
    },
    [rootNode, searchQuery, activeNode, parentIdMap, searchTerm, setActiveNode]
  );

  useEvent('keydown', onKeyDown);
};

export default useWindowInputKeyEvent;
