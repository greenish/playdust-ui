import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { useEvent } from 'react-use';
import { useRecoilState, useRecoilValue } from 'recoil';
import searchQueryActiveNodeMetaAtom from '../../_atoms/searchQueryActiveNodeMetaAtom';
import searchQueryParentIdMapAtom from '../../_atoms/searchQueryParentIdMapAtom';
import searchQueryRootNodeAtom from '../../_atoms/searchQueryRootNodeAtom';
import searchStateAtom from '../../_atoms/searchStateAtom';
import GroupNodeType from '../../_types/GroupNodeType';
import SearchQueryNodeType from '../../_types/SearchQueryNodeType';
import searchQueryTermAtom from '../_atoms/searchQueryTermAtom';

const useWindowInputKeyEvent = () => {
  const [activeNodeMeta, setActiveNodeMeta] = useRecoilState(
    searchQueryActiveNodeMetaAtom
  );
  const searchTerm = useRecoilValue(searchQueryTermAtom);
  const parentIdMap = useRecoilValue(searchQueryParentIdMapAtom);
  const { query } = useRecoilValue(searchStateAtom);
  const rootNode = useRecoilValue(searchQueryRootNodeAtom);
  const router = useRouter();

  const onKeyDown = useCallback(
    (evt: KeyboardEvent) => {
      const handleLeftRight = (key: 'left' | 'right') => {
        if (!activeNodeMeta || searchTerm !== '') {
          return;
        }
        const node = query.nodes[activeNodeMeta.nodeId];
        const isGroup = GroupNodeType.is(node);
        const parentId = parentIdMap[activeNodeMeta.nodeId];
        const parent: SearchQueryNodeType | null = parentId
          ? query.nodes[parentId] ?? null
          : null;
        const isParentGroup = GroupNodeType.is(parent);

        if (!node || !rootNode) {
          return;
        }

        const isLeft = key === 'left';

        if (evt.shiftKey && isGroup && activeNodeMeta.type === 'group') {
          const { endIndex, index, isGroupSelected } = activeNodeMeta;
          const currentEndIndex = endIndex === undefined ? index : endIndex;
          const endIdxOffset = isLeft ? -1 : 1;
          const nextEndIdx = currentEndIndex + endIdxOffset;
          const atEnd = isLeft
            ? nextEndIdx === -1
            : nextEndIdx === node.children.length + 1;
          console.log('made it')

          if (isGroupSelected && atEnd) {
            return;
          }

          if (isGroupSelected) {
            return setActiveNodeMeta({
              ...activeNodeMeta,
              isGroupSelected: false,
            });
          }

          if (!atEnd) {
            return setActiveNodeMeta({
              ...activeNodeMeta,
              isGroupSelected: false,
              endIndex: nextEndIdx,
            });
          }

          if (activeNodeMeta.nodeId !== rootNode.id) {
            return setActiveNodeMeta({
              ...activeNodeMeta,
              endIndex: activeNodeMeta.endIndex === undefined ? 0 : activeNodeMeta.endIndex,
              isGroupSelected: true,
            });
          }

          return
        }

        const offset = isLeft ? 0 : 1;

        if (activeNodeMeta.type === 'query' && isParentGroup) {
          const newPosition = parent.children.findIndex(
            (nodeId) => nodeId === activeNodeMeta.nodeId
          );

          setActiveNodeMeta({
            type: 'group',
            index: newPosition,
            nodeId: parent.id,
          });
        }

        if (activeNodeMeta.type === 'group' && isGroup) {
          let newIndex = isLeft
            ? Math.max(activeNodeMeta.index - 1, 0)
            : Math.min(activeNodeMeta.index + 1, node.children.length);
          let newNodeId = activeNodeMeta.nodeId;

          const nextNode = isLeft
            ? activeNodeMeta.index > 0 && query.nodes[node.children[newIndex]]
            : activeNodeMeta.index < node.children.length &&
              query.nodes[node.children[activeNodeMeta.index]];

          const endGroupIdx = isLeft ? 0 : node.children.length;

          // move to begin/end of root node
          if (evt.metaKey) {
            return setActiveNodeMeta({
              type: 'group',
              index: isLeft ? 0 : rootNode.children.length,
              nodeId: rootNode.id,
            });
          }

          // move into next group.
          if (!evt.altKey && GroupNodeType.is(nextNode)) {
            newIndex = isLeft ? nextNode.children.length : 0;
            newNodeId = nextNode.id;
          }

          // move out of current group.
          if (
            !evt.altKey &&
            activeNodeMeta.index === endGroupIdx &&
            isParentGroup
          ) {
            newIndex =
              parent.children.findIndex(
                (nodeId) => nodeId === activeNodeMeta.nodeId
              ) + offset;
            newNodeId = parent.id;
          }

          setActiveNodeMeta({
            type: 'group',
            index: newIndex,
            nodeId: newNodeId,
          });
        }
      };

      switch (evt.key) {
        case 'ArrowLeft': {
          handleLeftRight('left');
          break;
        }
        case 'ArrowRight': {
          handleLeftRight('right');
          break;
        }
        case 'z':
          if (evt.metaKey && evt.shiftKey) {
            return window.history.forward();
          }

          if (evt.metaKey) {
            return router.back();
          }

          break;
        default:
      }
    },
    [
      activeNodeMeta,
      searchTerm,
      query.nodes,
      parentIdMap,
      rootNode,
      setActiveNodeMeta,
      router,
    ]
  );

  useEvent('keydown', onKeyDown);
};

export default useWindowInputKeyEvent;
