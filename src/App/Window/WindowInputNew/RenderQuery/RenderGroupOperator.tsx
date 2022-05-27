import styled from '@emotion/styled';
import React from 'react';
import { useRecoilState } from 'recoil';
import searchQueryActiveNodeAtom from '../_atoms/searchQueryActiveNodeAtom';
import GroupRenderOperatorNodeType from './_types/GroupRenderOperatorNodeType';

const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 0px 4px;
`;

const belowActiveOperatorStyles = {
  borderTop: '7px solid rgb(180,180,180)',
  marginTop: '-11px',
  paddingTop: '4px',
};
const aboveActiveOperatorStyles = {
  borderBottom: '7px solid rgb(200,200,200)',
  marginBottom: '-11px',
  paddingBottom: '4px',
};

const activeBackground = {
  background: 'rgb(255,0,0, 0.08)',
};

const activeOperatorStyles = {
  color: 'red',
  fontWeight: 'bold',
};

function RenderGroupOperator({
  renderNode,
}: {
  renderNode: GroupRenderOperatorNodeType;
}) {
  const [activeNode, setActiveNode] = useRecoilState(searchQueryActiveNodeAtom);

  const { isBelowActive, isAboveActive, is2BelowActive, isActive } =
    renderNode.nodeState;

  const activeNodeIndex = activeNode?.type === 'group' ? activeNode.index : -1;
  const operator = renderNode.node.operator === 'and' ? 'AND' : 'OR';

  const renderIsAboveActive =
    isAboveActive &&
    !renderNode.node.children.includes(activeNode?.nodeId ?? '');

  if (renderNode.index === 0) {
    if (activeNodeIndex !== 0 || !isActive) {
      return null;
    }
  }

  return (
    <Container
      onClick={(evt) => {
        setActiveNode({
          type: 'group',
          nodeId: renderNode.node.id,
          index: renderNode.index,
        });
        evt.stopPropagation();
      }}
      style={{
        ...(renderIsAboveActive ? aboveActiveOperatorStyles : {}),
        ...(is2BelowActive ? belowActiveOperatorStyles : {}),
        ...(isBelowActive ? activeBackground : {}),
        ...(isActive ? activeOperatorStyles : {}),
      }}
    >
      {operator}
    </Container>
  );
}

export default RenderGroupOperator;
