import styled from '@emotion/styled';
import { Box, useTheme } from '@mui/material';
import React, { useCallback, useEffect, useRef } from 'react';
import AutosizeInput from 'react-input-autosize';
import { useClickAway } from 'react-use';
import { useRecoilState, useRecoilValue } from 'recoil';
import { is } from 'superstruct';
import QueryNodeType from '../../../_types/QueryNodeType';
import QueryNodeChip from './QueryNodeChip';
import searchQueryActiveNodeAtom from './_atoms/searchQueryActiveNodeAtom';
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

type GroupNodeProps = {
  node: GroupNodeType;
  textInput: JSX.Element;
  depth?: number;
  inActiveGroup?: boolean;
};

type QueryNodeProps = {
  node: QueryNodeType;
  inActiveGroup?: boolean;
};

const activeGroupStyles = {
  background: 'rgb(255,0,0, 0.08)',
  padding: '4px',
  margin: '-4px',
};

function QueryNode({ node, inActiveGroup = false }: QueryNodeProps) {
  const [activeNode, setActiveNode] = useRecoilState(searchQueryActiveNodeAtom);

  return (
    <QueryNodeChipContainer
      style={{
        ...(inActiveGroup ? activeGroupStyles : {}),
      }}
    >
      <QueryNodeChip
        isActive={node.id === activeNode?.nodeId}
        node={node}
        disabled={false}
        onClick={(evt) => {
          setActiveNode({ nodeId: node.id });

          evt.stopPropagation();
        }}
      />
    </QueryNodeChipContainer>
  );
}
type GroupOperator = {
  groupPosition: number;
  groupNode: GroupNodeType;
  textInput: JSX.Element;
};

function GroupOperator({ groupNode, groupPosition, textInput }: GroupOperator) {
  const [activeNode, setActiveNode] = useRecoilState(searchQueryActiveNodeAtom);
  const isActiveGroup =
    activeNode?.type === 'group' && activeNode?.nodeId === groupNode.id;
  const isFirst = groupPosition === 0;
  const isLast = groupPosition === groupNode.children.length;

  const operator = groupNode.operator === 'and' ? 'AND' : 'OR';
  const Operator = (
    <GroupNodeJoinContainer
      onClick={(evt) => {
        setActiveNode({
          type: 'group',
          nodeId: groupNode.id,
          index: groupPosition,
        });
        evt.stopPropagation();
      }}
    >
      {isActiveGroup ? <ActiveOperator>{operator}</ActiveOperator> : operator}
    </GroupNodeJoinContainer>
  );

  if (isActiveGroup && groupPosition === activeNode.index) {
    return (
      <>
        <GroupNodeJoinContainer
          onClick={(evt) => {
            setActiveNode({
              type: 'group',
              nodeId: groupNode.id,
              index: groupPosition,
            });
            evt.stopPropagation();
          }}
        >
          <ActiveOperator
            style={{ color: 'grey' }}
          >{`${operator}:`}</ActiveOperator>
        </GroupNodeJoinContainer>
        {textInput}
        {!isLast && Operator}
      </>
    );
  }

  if (isFirst || isLast) {
    return null;
  }

  return Operator;
}

function GroupNode({
  node,
  depth = 0,
  textInput,
  inActiveGroup = false,
}: GroupNodeProps) {
  const { rootNode, nodes } = useRecoilValue(searchQueryAtom);
  const [activeNode, setActiveNode] = useRecoilState(searchQueryActiveNodeAtom);

  const isRoot = node.id === rootNode.id;
  const isActiveGroup = activeNode?.nodeId === node.id;

  return (
    <GroupNodeContainer
      sx={{
        ...(inActiveGroup ? activeGroupStyles : {}),
      }}
    >
      {!isRoot && (
        <GroupNodeJoinContainer
          onClick={(evt) => {
            setActiveNode({
              type: 'group',
              nodeId: node.id,
              index: 0,
            });
            evt.stopPropagation();
          }}
          style={{
            paddingLeft: '0px',
          }}
        >
          {isActiveGroup ? <ActiveOperator>(</ActiveOperator> : '('}
        </GroupNodeJoinContainer>
      )}
      {node.children.map((childId, idx) => {
        const childNode = nodes[childId];
        const isLast = idx === node.children.length - 1;

        return (
          <GroupNodeChildrenContainer key={childId}>
            <GroupOperator
              groupNode={node}
              groupPosition={idx}
              textInput={textInput}
            />
            {!is(childNode, GroupNodeType) ? (
              <QueryNode node={childNode} inActiveGroup={isActiveGroup} />
            ) : (
              <GroupNode
                node={childNode}
                depth={depth + 1}
                textInput={textInput}
                inActiveGroup={isActiveGroup}
              />
            )}
            {isLast && (
              <GroupOperator
                groupNode={node}
                groupPosition={idx + 1}
                textInput={textInput}
              />
            )}
          </GroupNodeChildrenContainer>
        );
      })}
      {!isRoot && (
        <GroupNodeJoinContainer
          onClick={(evt) => {
            setActiveNode({
              type: 'group',
              nodeId: node.id,
              index: node.children.length,
            });
            evt.stopPropagation();
          }}
          style={{
            paddingRight: '0px',
          }}
        >
          {isActiveGroup ? <ActiveOperator>)</ActiveOperator> : ')'}
        </GroupNodeJoinContainer>
      )}
    </GroupNodeContainer>
  );
}

function WindowInputNew() {
  const [activeNodeId, setActiveNode] = useRecoilState(
    searchQueryActiveNodeAtom
  );
  const { rootNode } = useRecoilValue(searchQueryAtom);
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
    setActiveNode({ nodeId: rootNode.id });
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
      }}
    >
      <GroupNode
        node={rootNode}
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
            onClick={(e) => e.stopPropagation()}
          />
        }
      />
    </RootContainer>
  );
}

export default WindowInputNew;
