import styled from '@emotion/styled';
import { Box, useTheme } from '@mui/material';
import React, { useCallback, useEffect, useRef } from 'react';
import AutosizeInput from 'react-input-autosize';
import { useClickAway } from 'react-use';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import QueryNodeChip from './QueryNodeChip/QueryNodeChip';
import RenderQuery from './RenderQuery/RenderQuery';
import SuggestionOverlay from './SuggestionOverlay/SuggestionOverlay';
import attributeNodeDeltaAtom from './_atoms/attributeNodeDeltaAtom';
import searchQueryActiveNodeAtom from './_atoms/searchQueryActiveNodeAtom';
import searchQueryRootNodeAtom from './_atoms/searchQueryRootNodeAtom';
import searchQueryTermAtom from './_atoms/searchQueryTermAtom';
import useWindowInputKeyEvent from './_hooks/useWindowInputKeyEvent';

const RootContainer = styled.div`
  position: relative;
  width: 100%;
`;

const InputContainer = styled(Box)`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  flex-wrap: wrap;
  padding: 0 8px;
  font-size: 80%;
  background: none;
`;

function WindowInputNew() {
  const [activeNode, setActiveNode] = useRecoilState(searchQueryActiveNodeAtom);
  const rootNode = useRecoilValue(searchQueryRootNodeAtom);
  const [term, setTerm] = useRecoilState(searchQueryTermAtom);
  const delta = useRecoilValue(attributeNodeDeltaAtom);
  const deltaResetter = useResetRecoilState(attributeNodeDeltaAtom);
  const theme = useTheme();
  const isActive = !!activeNode;
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

  useEffect(() => {
    if (delta.length > 0) {
      // This is temporary, this should trigger a URL change instead of the reset
      deltaResetter();
    }
  }, [activeNode]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    inputRef?.current?.focus();
  }, [delta]);

  useWindowInputKeyEvent();

  const textInput = (
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
  );

  return (
    <RootContainer ref={containerRef}>
      <InputContainer
        sx={{
          border: 'solid',
          borderColor,
          borderWidth,
          '&:hover': {
            borderColor: theme.palette.primary.main,
          },
        }}
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
              textInput={textInput}
            />
          )}
          renderTextInput={() => (
            <QueryNodeChip
              onClick={(evt) => {
                evt.stopPropagation();
              }}
              textInput={textInput}
            />
          )}
        />
      </InputContainer>
      {activeNode && <SuggestionOverlay />}
    </RootContainer>
  );
}

export default WindowInputNew;
