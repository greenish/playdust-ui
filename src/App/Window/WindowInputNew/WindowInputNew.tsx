import styled from '@emotion/styled';
import { Box, useTheme } from '@mui/material';
import React, { useCallback, useEffect, useRef } from 'react';
import AutosizeInput from 'react-input-autosize';
import { useClickAway } from 'react-use';
import { useRecoilState, useRecoilValue } from 'recoil';
import QueryNodeChip from './QueryNodeChip';
import RenderQuery from './RenderQuery/RenderQuery';
import searchQueryActiveNodeAtom from './_atoms/searchQueryActiveNodeAtom';
import searchQueryRootNodeAtom from './_atoms/searchQueryRootNodeAtom';
import searchQueryTermAtom from './_atoms/searchQueryTermAtom';
import useWindowInputKeyEvent from './_hooks/useWindowInputKeyEvent';

const RootContainer = styled(Box)`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  flex-wrap: wrap;
  padding: 12px 16px;
  margin: 8px 24px;
  font-size: 80%;
  background: none;
`;

function WindowInputNew() {
  const [activeNodeId, setActiveNode] = useRecoilState(
    searchQueryActiveNodeAtom
  );
  const rootNode = useRecoilValue(searchQueryRootNodeAtom);
  const [term, setTerm] = useRecoilState(searchQueryTermAtom);
  const theme = useTheme();
  const isActive = !!activeNodeId;
  const borderColor = isActive
    ? theme.palette.primary.main
    : theme.palette.grey[400];
  const borderWidth = isActive ? 1.5 : 1;

  const containerRef = useRef(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const setInputRef = useCallback((inputElement: HTMLInputElement | null) => {
    inputRef.current = inputElement;
  }, []);

  useClickAway(containerRef, () => {
    setActiveNode(null);
  });

  useWindowInputKeyEvent();

  useEffect(() => {
    setActiveNode({
      type: 'group',
      nodeId: rootNode.id,
      index: rootNode.children.length,
    });
    inputRef?.current?.focus();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <RootContainer
      sx={{
        border: 'solid',
        borderColor,
        borderWidth,
        '&:hover': {
          borderColor: theme.palette.primary.main,
        },
      }}
      ref={containerRef}
      onClick={() => {
        setActiveNode({
          type: 'group',
          nodeId: rootNode.id,
          index: rootNode.children.length,
        });
        inputRef?.current?.focus();
      }}
    >
      <RenderQuery
        renderQueryNode={(queryNode) => (
          <QueryNodeChip
            onClick={(evt) => {
              setActiveNode({ nodeId: queryNode.id, type: 'query' });
              evt.stopPropagation();
            }}
            node={queryNode}
          />
        )}
        renderTextInput={() => (
          <AutosizeInput
            inputStyle={{
              fontFamily: 'inherit',
              border: 'none',
              outline: 'none',
              background: 'inherit',
            }}
            inputRef={setInputRef}
            value={term}
            onChange={(evt) => setTerm(evt.target.value)}
            autoFocus={true}
            onClick={(e) => e.stopPropagation()}
          />
        )}
      />
    </RootContainer>
  );
}

export default WindowInputNew;
