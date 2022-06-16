import React from 'react';
import QueryPartContainer from './_sharedComponents/QueryPartContainer';
import QueryRenderNodeType from './_types/QueryRenderNodeType';

function RenderQueryNode({
  renderNode,
  children,
}: React.PropsWithChildren<{ renderNode: QueryRenderNodeType }>) {
  return (
    <QueryPartContainer renderNode={renderNode}>
      {children}
    </QueryPartContainer>
  );
}

export default RenderQueryNode;
