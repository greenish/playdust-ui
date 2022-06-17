import { useCallback } from 'react';
import { useEvent } from 'react-use';
import { useRecoilState, useRecoilValue } from 'recoil';
import searchQueryActiveNodeMetaAtom from '../../_atoms/searchQueryActiveNodeMetaAtom';
import searchQueryParentIdMapAtom from '../../_atoms/searchQueryParentIdMapAtom';
import searchQueryRootNodeAtom from '../../_atoms/searchQueryRootNodeAtom';
import searchStateAtom from '../../_atoms/searchStateAtom';
import GroupNodeType from '../../_types/GroupNodeType';
import SearchQueryNodeType from '../../_types/SearchQueryNodeType';
import searchQueryActiveNodeAtom from '../_atoms/searchQueryActiveNodeAtom';
import searchQuerySelectedNodesAtom from '../_atoms/searchQuerySelectedNodesAtom';
import searchQueryTermAtom from '../_atoms/searchQueryTermAtom';
import searchSuggestionIdxAtom from '../_atoms/searchSuggestionIdxAtom';
import searchSuggestionsAtom from '../_atoms/searchSuggestionsAtom';
import useAddGroupQueryNode from './useAddGroupQueryNode';
import useOnSuggestionChange from './useOnSuggestionChange';
import useRemoveSelection from './useRemoveSelection';

const useHandleLR = () => {
  const searchTerm = useRecoilValue(searchQueryTermAtom);
  const [activeNodeMeta, setActiveNodeMeta] = useRecoilState(
    searchQueryActiveNodeMetaAtom
  );
  const activeNode = useRecoilValue(searchQueryActiveNodeAtom);
  const parentIdMap = useRecoilValue(searchQueryParentIdMapAtom);
  const { query } = useRecoilValue(searchStateAtom);
  const rootNode = useRecoilValue(searchQueryRootNodeAtom);

  return (evt: KeyboardEvent, isLeft: boolean) => {
    if (!activeNodeMeta || searchTerm !== '') {
      return;
    }
    const isGroup = GroupNodeType.is(activeNode);
    const parentId = parentIdMap[activeNodeMeta.nodeId];
    const parent: SearchQueryNodeType | null = parentId
      ? query.nodes[parentId] ?? null
      : null;
    const isParentGroup = GroupNodeType.is(parent);

    if (!activeNode || !rootNode) {
      return;
    }

    const offset = isLeft ? 0 : 1;

    if (activeNodeMeta?.type === 'query' && isParentGroup) {
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
        : Math.min(activeNodeMeta.index + 1, activeNode.children.length);
      let newNodeId = activeNodeMeta.nodeId;

      const nextNode = isLeft
        ? activeNodeMeta.index > 0 && query.nodes[activeNode.children[newIndex]]
        : activeNodeMeta.index < activeNode.children.length &&
          query.nodes[activeNode.children[activeNodeMeta.index]];

      const endGroupIdx = isLeft ? 0 : activeNode.children.length;

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
};

const useHandleShiftLR = () => {
  const [activeNodeMeta, setActiveNodeMeta] = useRecoilState(
    searchQueryActiveNodeMetaAtom
  );
  const rootNode = useRecoilValue(searchQueryRootNodeAtom);
  const activeNode = useRecoilValue(searchQueryActiveNodeAtom);

  return (isLeft: boolean) => {
    const isGroup = GroupNodeType.is(activeNode);

    if (rootNode && isGroup && activeNodeMeta?.type === 'group') {
      const { endIndex, index, isGroupSelected } = activeNodeMeta;
      const currentEndIndex = endIndex === undefined ? index : endIndex;
      const endIdxOffset = isLeft ? -1 : 1;
      const nextEndIdx = currentEndIndex + endIdxOffset;
      const atEnd = isLeft
        ? nextEndIdx === -1
        : nextEndIdx === activeNode.children.length + 1;

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
          endIndex:
            activeNodeMeta.endIndex === undefined ? 0 : activeNodeMeta.endIndex,
          isGroupSelected: true,
        });
      }
    }
  };
};

const useHandleUD = () => {
  const [activeIdx, setActiveIdx] = useRecoilState(searchSuggestionIdxAtom);
  const { suggestions } = useRecoilValue(searchSuggestionsAtom);
  const lastSuggestionIdx = suggestions.length - 1;

  return (isUp: boolean) => {
    const nextUpValue = activeIdx === 0 ? lastSuggestionIdx : activeIdx - 1;
    const nextDownValue = activeIdx === lastSuggestionIdx ? 0 : activeIdx + 1;
    const nextValue = isUp ? nextUpValue : nextDownValue;

    setActiveIdx(nextValue);
  };
};

const useHandleEnter = () => {
  const onSuggestionChange = useOnSuggestionChange();
  const activeIdx = useRecoilValue(searchSuggestionIdxAtom);
  const { suggestions } = useRecoilValue(searchSuggestionsAtom);

  return () => onSuggestionChange(suggestions[activeIdx]);
};

const handleZ = (evt: KeyboardEvent) => {
  if (evt.metaKey && evt.shiftKey) {
    return window.history.forward();
  }

  if (evt.metaKey) {
    return window.history.back();
  }
};

const useHandleBackspace = () => {
  const selectedNodes = useRecoilValue(searchQuerySelectedNodesAtom);
  const removeSelection = useRemoveSelection();

  return () => {
    if (selectedNodes.length) {
      removeSelection();
    }
  };
};

const useHandleGroupChar = () => {
  const activeNodeMeta = useRecoilValue(searchQueryActiveNodeMetaAtom);
  const addGroupQueryNode = useAddGroupQueryNode();

  return () => {
    if (activeNodeMeta?.type !== 'group') {
      return;
    }

    if (activeNodeMeta.endIndex !== undefined) {
      return addGroupQueryNode();
    }
  };
};

const useWindowInputKeyEvent = () => {
  const handleLR = useHandleLR();
  const handleShiftLR = useHandleShiftLR();
  const handleUD = useHandleUD();
  const handleEnter = useHandleEnter();
  const handleBackspace = useHandleBackspace();
  const handleGroupChar = useHandleGroupChar();

  const onKeyDown = useCallback(
    (evt: KeyboardEvent) => {
      switch (evt.key) {
        case 'ArrowLeft':
        case 'ArrowRight': {
          const isLeft = evt.key === 'ArrowLeft';

          if (evt.shiftKey) {
            return handleShiftLR(isLeft);
          }

          return handleLR(evt, isLeft);
        }
        case 'ArrowUp':
        case 'ArrowDown':
          return handleUD(evt.key === 'ArrowUp');
        case 'Enter':
          return handleEnter();
        case 'Backspace':
          return handleBackspace();
        case '(':
        case ')':
          return handleGroupChar();
        case 'z':
          return handleZ(evt);
        default:
      }
    },
    [
      handleBackspace,
      handleEnter,
      handleGroupChar,
      handleLR,
      handleShiftLR,
      handleUD,
    ]
  );

  useEvent('keydown', onKeyDown);
};

export default useWindowInputKeyEvent;
