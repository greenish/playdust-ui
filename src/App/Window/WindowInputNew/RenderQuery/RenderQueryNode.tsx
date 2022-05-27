import styled from '@emotion/styled';
import React from 'react';
import QueryRenderNodeType from './_types/QueryRenderNodeType';

const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 0px 4px;
`;

const twoBelowActiveOperatorStyles = {
  borderTop: '7px solid rgb(180,180,180)',
  marginTop: '-11px',
  paddingTop: '4px',
};

const belowActiveOperatorStyles = {
  background: 'rgb(255,0,0, 0.08)',
};

const aboveActiveOperatorStyles = {
  borderBottom: '7px solid rgb(200,200,200)',
  marginBottom: '-11px',
  paddingBottom: '4px',
};

const stylesActive = {
  // background: 'rgb(255,0,0, 0.08)',
};

function RenderQueryNode({
  renderNode,
  children,
}: React.PropsWithChildren<{ renderNode: QueryRenderNodeType }>) {
  const { isBelowActive, is2BelowActive, isAboveActive, isActive } =
    renderNode.nodeState;

  return (
    <Container
      style={{
        ...(is2BelowActive ? twoBelowActiveOperatorStyles : {}),
        ...(isBelowActive ? belowActiveOperatorStyles : {}),
        ...(isAboveActive ? aboveActiveOperatorStyles : {}),
        ...(isActive ? stylesActive : {}),
      }}
    >
      {children}
    </Container>
  );
}

export default RenderQueryNode;
