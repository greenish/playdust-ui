import { useCallback } from 'react';
import { useEvent } from 'react-use';
import { useRecoilState, useRecoilValue } from 'recoil';
import { is } from 'superstruct';
import searchQueryActiveNodeMetaAtom from '../../_atoms/searchQueryActiveNodeMetaAtom';
import searchQueryRootNodeAtom from '../../_atoms/searchQueryRootNodeAtom';
import searchQueryTermAtom from '../../_atoms/searchQueryTermAtom';
import searchStateAtom from '../../_atoms/searchStateAtom';
import GroupNodeType from '../../_types/GroupNodeType';
import SearchQueryNodeType from '../../_types/SearchQueryNodeType';
import searchQueryParentIdMapAtom from '../_atoms/searchQueryParentIdMapAtom';

const useWindowInputKeyEvent = () => {
  const [activeNodeMeta, setActiveNodeMeta] = useRecoilState(
    searchQueryActiveNodeMetaAtom
  );
  const searchTerm = useRecoilValue(searchQueryTermAtom);
  const parentIdMap = useRecoilValue(searchQueryParentIdMapAtom);
  const { query } = useRecoilValue(searchStateAtom);
  const rootNode = useRecoilValue(searchQueryRootNodeAtom);

  const onKeyDown = useCallback(
    (evt: KeyboardEvent) => {
      if (!activeNodeMeta || searchTerm !== '') {
        return;
      }
      const node = query.nodes[activeNodeMeta.nodeId];
      const parentId = parentIdMap[activeNodeMeta.nodeId];
      const parent: SearchQueryNodeType | null = parentId
        ? query.nodes[parentId] ?? null
        : null;

      if (!node || !rootNode) {
        return;
      }

      switch (evt.key) {
        case 'ArrowLeft': {
          if (activeNodeMeta.type === 'query' && is(parent, GroupNodeType)) {
            const newPosition = parent.children.findIndex(
              (nodeId) => nodeId === activeNodeMeta.nodeId
            );
            setActiveNodeMeta({
              type: 'group',
              index: newPosition,
              nodeId: parent.id,
            });
          }
          if (activeNodeMeta.type === 'group' && is(node, GroupNodeType)) {
            let newIndex = Math.max(activeNodeMeta.index - 1, 0);
            let newNodeId = activeNodeMeta.nodeId;

            const nextNode =
              activeNodeMeta.index > 0 && query.nodes[node.children[newIndex]];

            // move to start of current group
            if (evt.metaKey) {
              setActiveNodeMeta({
                type: 'group',
                index: 0,
                nodeId: rootNode.id,
              });
              return;
            }
            // move ontop of next query/pill
            if (evt.shiftKey && nextNode && !is(nextNode, GroupNodeType)) {
              setActiveNodeMeta({ type: 'query', nodeId: nextNode.id });
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
              activeNodeMeta.index === 0 &&
              is(parent, GroupNodeType)
            ) {
              newIndex = parent.children.findIndex(
                (nodeId) => nodeId === activeNodeMeta.nodeId
              );
              newNodeId = parent.id;
            }

            setActiveNodeMeta({
              type: 'group',
              index: newIndex,
              nodeId: newNodeId,
            });
          }
          break;
        }
        case 'ArrowRight': {
          if (activeNodeMeta.type === 'query' && is(parent, GroupNodeType)) {
            const newPosition =
              parent.children.findIndex(
                (nodeId) => nodeId === activeNodeMeta.nodeId
              ) + 1;
            setActiveNodeMeta({
              type: 'group',
              index: newPosition,
              nodeId: parent.id,
            });
          }
          if (activeNodeMeta.type === 'group' && is(node, GroupNodeType)) {
            let newIndex = Math.min(
              activeNodeMeta.index + 1,
              node.children.length
            );
            let newNodeId = activeNodeMeta.nodeId;

            const nextNode =
              activeNodeMeta.index < node.children.length &&
              query.nodes[node.children[activeNodeMeta.index]];

            // move to end of current group
            if (evt.metaKey) {
              setActiveNodeMeta({
                type: 'group',
                index: rootNode.children.length,
                nodeId: rootNode.id,
              });
              return;
            }
            // move ontop of next query/pill
            if (evt.shiftKey && nextNode && !is(nextNode, GroupNodeType)) {
              setActiveNodeMeta({ type: 'query', nodeId: nextNode.id });
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
              activeNodeMeta.index === node.children.length &&
              is(parent, GroupNodeType)
            ) {
              newIndex =
                parent.children.findIndex(
                  (nodeId) => nodeId === activeNodeMeta.nodeId
                ) + 1;
              newNodeId = parent.id;
            }

            setActiveNodeMeta({
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
    [
      rootNode,
      query,
      activeNodeMeta,
      parentIdMap,
      searchTerm,
      setActiveNodeMeta,
    ]
  );

  useEvent('keydown', onKeyDown);
};

export default useWindowInputKeyEvent;
