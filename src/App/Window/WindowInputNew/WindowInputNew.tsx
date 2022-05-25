import styled from '@emotion/styled';
import { Box, useTheme } from '@mui/material';
import React, { useCallback, useEffect, useRef } from 'react';
import AutosizeInput from 'react-input-autosize';
import { useClickAway } from 'react-use';
import { useRecoilState, useRecoilValue } from 'recoil';
import { is } from 'superstruct';
import QueryNodeChip from './QueryNodeChip';
import searchQueryActiveNodeIdAtom from './_atoms/searchQueryActiveNodeIdAtom';
import searchQueryAtom from './_atoms/searchQueryAtom';
import searchQueryTermAtom from './_atoms/searchQueryTermAtom';
import useWindowInputKeyEvent from './_hooks/useWindowInputKeyEvent';
import GroupNodeType from './_types/GroupNodeType';

const rootHeight = 40;

const RootContainer = styled(Box)`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding: 0 8px;
  height: ${rootHeight + 16}px;
  font-size: 80%;
  background: none;
`;

const GroupNodeContainer = styled(Box)`
  display: flex;
  align-items: center;
  padding: 0 8px;
`;

const GroupNodeChildrenContainer = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
`;

const GroupNodeJoinContainer = styled.div`
  display: flex;
  height: ${rootHeight}px;
  align-items: center;
  padding: 0 4px;
`;

const QueryNodeChipContainer = styled.div`
  display: flex;
  height: ${rootHeight}px;
  align-items: center;
`;

type FlattenedElementsProps = {
  id: string;
  depth?: number;
  textInput: JSX.Element;
};

function FlattenedElements({
  id,
  depth = 0,
  textInput,
}: FlattenedElementsProps) {
  const { nodes } = useRecoilValue(searchQueryAtom);
  const [activeNodeId, setActiveNodeId] = useRecoilState(
    searchQueryActiveNodeIdAtom
  );
  const node = nodes[id];
  const theme = useTheme();

  if (!is(node, GroupNodeType)) {
    return (
      <QueryNodeChipContainer>
        <QueryNodeChip
          isActive={id === activeNodeId}
          node={node}
          disabled={false}
          onClick={(evt) => {
            setActiveNodeId(id);

            evt.stopPropagation();
          }}
        />
      </QueryNodeChipContainer>
    );
  }

  const isActiveGroup = activeNodeId === id;
  const background = theme.palette.grey[500];
  const height = rootHeight - depth * 4;
  const outlineColor = isActiveGroup ? theme.palette.primary.main : background;

  return (
    <GroupNodeContainer
      sx={{
        background,
        outline: `solid 1px ${outlineColor}`,
        filter: 'brightness(115%)',
        height,
        borderRadius: `${height / 2}px`,
      }}
      onClick={(evt) => {
        setActiveNodeId(id);
        evt.stopPropagation();
      }}
    >
      {node.children.map((childId, idx) => {
        const isLast = idx === node.children.length - 1;

        return (
          <GroupNodeChildrenContainer key={childId}>
            <FlattenedElements
              id={childId}
              depth={depth + 1}
              textInput={textInput}
            />
            {!isLast && (
              <GroupNodeJoinContainer>{node.operator}</GroupNodeJoinContainer>
            )}
            {isActiveGroup && isLast && (
              <>
                {activeNodeId && (
                  <GroupNodeJoinContainer>
                    {node.operator}
                  </GroupNodeJoinContainer>
                )}
                {textInput}
              </>
            )}
          </GroupNodeChildrenContainer>
        );
      })}
    </GroupNodeContainer>
  );
}

function WindowInputNew() {
  const [activeNodeId, setActiveNodeId] = useRecoilState(
    searchQueryActiveNodeIdAtom
  );
  const { rootId } = useRecoilValue(searchQueryAtom);
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
    setActiveNodeId(null);
  });

  useWindowInputKeyEvent();

  useEffect(() => {
    setActiveNodeId(rootId);
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
        setActiveNodeId(rootId);
      }}
    >
      <FlattenedElements
        id={rootId}
        textInput={
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
          />
        }
      />
    </RootContainer>
  );
}

export default WindowInputNew;
