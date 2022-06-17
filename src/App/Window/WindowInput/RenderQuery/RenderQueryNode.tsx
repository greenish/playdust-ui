import React from 'react';
import QueryNodeChip from '../QueryNodeChip/QueryNodeChip';
import QueryPartContainer from './_sharedComponents/QueryPartContainer';
import QueryRenderNodeType from './_types/QueryRenderNodeType';

type RenderQueryNodeProps = {
  renderNode: QueryRenderNodeType
  textInput: JSX.Element
}

function RenderQueryNode({
  renderNode,
  textInput
}: RenderQueryNodeProps) {
  return (
    <QueryPartContainer renderNode={renderNode}>
      <QueryNodeChip
        node={renderNode.node}
        textInput={textInput}
      />
    </QueryPartContainer>
  );
}

export default RenderQueryNode;
