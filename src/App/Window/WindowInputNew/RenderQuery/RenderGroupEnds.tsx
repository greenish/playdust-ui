import styled from '@emotion/styled';
import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import searchQueryActiveNodeAtom from '../_atoms/searchQueryActiveNodeAtom';
import searchQueryRootNodeAtom from '../_atoms/searchQueryRootNodeAtom';
import GroupRenderNodeType from './_types/GroupRenderNodeType';

const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 0px 4px;
`;

const stylesStart = {
  paddingRight: '4px',
};

const stylesEnd = {
  paddingLeft: '4px',
};
const belowActiveOperatorStyles = {
  borderTop: '7px solid rgb(180,180,180)',
  marginTop: '-11px',
  paddingTop: '4px',
  background: 'rgb(255,0,0, 0.08)',
};
const aboveActiveOperatorStyles = {
  borderBottom: '7px solid rgb(200,200,200)',
  marginBottom: '-11px',
  paddingBottom: '4px',
};

const activeBackground = {
  background: 'rgb(255,0,0, 0.08)',
};

const stylesActive = {
  color: 'red',
  // background: 'rgb(255,0,0, 0.08)',
  fontWeight: 'bold',
};

function RenderGroupEnds({ renderNode }: { renderNode: GroupRenderNodeType }) {
  const [activeNode, setActiveNode] = useRecoilState(searchQueryActiveNodeAtom);
  const rootNode = useRecoilValue(searchQueryRootNodeAtom);
  const isRoot = rootNode.id === renderNode.node.id;
  const { isBelowActive, is2BelowActive, isAboveActive, isActive } =
    renderNode.nodeState;

  const symbol = renderNode.type === 'groupStart' ? '(' : ')';
  const index =
    renderNode.type === 'groupStart' ? 0 : renderNode.node.children.length;

  const renderIsAboveActive =
    isAboveActive &&
    !renderNode.node.children.includes(activeNode?.nodeId ?? '');

  return (
    <Container
      onClick={(evt) => {
        setActiveNode({
          type: 'group',
          nodeId: renderNode.node.id,
          index,
        });
        evt.stopPropagation();
      }}
      style={{
        ...(renderNode.type === 'groupStart' ? stylesStart : {}),
        ...(renderNode.type === 'groupEnd' ? stylesEnd : {}),
        ...(is2BelowActive ? belowActiveOperatorStyles : {}),
        ...(renderIsAboveActive ? aboveActiveOperatorStyles : {}),
        ...(isBelowActive ? activeBackground : {}),
        ...(isActive ? stylesActive : {}),
      }}
    >
      {!isRoot && symbol}
    </Container>
  );
}

export default RenderGroupEnds;
