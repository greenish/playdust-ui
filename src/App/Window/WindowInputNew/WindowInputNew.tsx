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

const activeColor = 'red';

const RootContainer = styled(Box)`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 12px 16px;
  margin: 8px 24px;
  font-size: 80%;
  background: none;
`;

const GroupNodeContainer = styled(Box)`
  display: flex;
  align-items: center;
`;

const GroupNodeChildrenContainer = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
`;

const GroupNodeJoinContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0 8px;
`;

const QueryNodeChipContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ActiveOperator = styled.b`
  color: ${activeColor};
  margin: '-2px';
`;

type FlattenedElementsProps = {
  id: string;
  depth?: number;
  textInput: JSX.Element;
  inActiveGroup?: boolean;
};

function FlattenedElements({
  id,
  depth = 0,
  textInput,
  inActiveGroup = false,
}: FlattenedElementsProps) {
  const { rootId, nodes } = useRecoilValue(searchQueryAtom);
  const [activeNodeId, setActiveNodeId] = useRecoilState(
    searchQueryActiveNodeIdAtom
  );
  const node = nodes[id];
  // const theme = useTheme();

  const activeGroupStyles = {
    background: 'rgb(255,0,0, 0.08)',
    padding: '4px',
    margin: '-4px',
  };

  if (!is(node, GroupNodeType)) {
    return (
      <QueryNodeChipContainer
        style={{
          ...(inActiveGroup ? activeGroupStyles : {}),
        }}
      >
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

  const isRoot = id === rootId;
  const isActiveGroup = activeNodeId === id;

  return (
    <GroupNodeContainer
      sx={{
        ...(inActiveGroup ? activeGroupStyles : {}),
      }}
      onClick={(evt) => {
        setActiveNodeId(id);
        evt.stopPropagation();
      }}
    >
      {!isRoot && (isActiveGroup ? <ActiveOperator>(</ActiveOperator> : '(')}
      {node.children.map((childId, idx) => {
        const isLast = idx === node.children.length - 1;

        return (
          <GroupNodeChildrenContainer key={childId}>
            <FlattenedElements
              id={childId}
              depth={depth + 1}
              textInput={textInput}
              inActiveGroup={isActiveGroup}
            />
            {!isLast && (
              <GroupNodeJoinContainer>
                {isActiveGroup ? (
                  <ActiveOperator>{node.operator}</ActiveOperator>
                ) : (
                  node.operator
                )}
              </GroupNodeJoinContainer>
            )}
            {isActiveGroup && isLast && (
              <>
                {activeNodeId && (
                  <GroupNodeJoinContainer>
                    {isActiveGroup ? (
                      <ActiveOperator>{node.operator}</ActiveOperator>
                    ) : (
                      node.operator
                    )}
                  </GroupNodeJoinContainer>
                )}
                {textInput}
              </>
            )}
          </GroupNodeChildrenContainer>
        );
      })}
      {!isRoot && (isActiveGroup ? <ActiveOperator>)</ActiveOperator> : ')')}
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
