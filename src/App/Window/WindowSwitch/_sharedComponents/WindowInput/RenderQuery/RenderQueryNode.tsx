import React from 'react';
import QueryPartContainer from './_sharedComponents/QueryPartContainer';
import QueryPartDecorator from './_sharedComponents/QueryPartDecorator';
import QueryRenderNodeType from './_types/QueryRenderNodeType';

const belowActiveOperatorStyles = {
  background: 'rgb(255,0,0, 0.08)',
};

function RenderQueryNode({
  renderNode,
  children,
}: React.PropsWithChildren<{ renderNode: QueryRenderNodeType }>) {
  const isAboveActive =
    renderNode.activeDistance !== null && renderNode.activeDistance >= 0;
  const isBelowActive =
    renderNode.activeDistance !== null &&
    renderNode.inActiveBranch &&
    renderNode.activeDistance >= 1;
  const is2BelowActive =
    renderNode.activeDistance !== null &&
    renderNode.inActiveBranch &&
    renderNode.activeDistance >= 2;

  return (
    <QueryPartContainer
      style={{
        ...(isBelowActive ? belowActiveOperatorStyles : {}),
      }}
    >
      {children}
      {isAboveActive && <QueryPartDecorator position="below" />}
      {is2BelowActive && <QueryPartDecorator position="above" />}
    </QueryPartContainer>
  );
}

export default RenderQueryNode;
