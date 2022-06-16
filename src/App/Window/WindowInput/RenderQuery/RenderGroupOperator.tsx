import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import searchQueryActiveNodeMetaAtom from '../../_atoms/searchQueryActiveNodeMetaAtom';
import searchQueryRenderNodeMetaAtom from './_atoms/searchQueryRenderNodeMetaAtom';
import QueryPartContainer from './_sharedComponents/QueryPartContainer';
import GroupRenderOperatorNodeType from './_types/GroupRenderOperatorNodeType';

const secondaryHighlight = {
  color: 'rgb(180,180,180)',
  fontWeight: 'bold',
};

function RenderGroupOperator({
  renderNode,
}: {
  renderNode: GroupRenderOperatorNodeType;
}) {
  const [activeNodeMeta, setActiveNodeMeta] = useRecoilState(
    searchQueryActiveNodeMetaAtom
  );
  const { isActive } =
    useRecoilValue(searchQueryRenderNodeMetaAtom(renderNode));

  const isBelowOperator =
    renderNode.activeDistance !== null &&
    renderNode.inActiveBranch &&
    renderNode.activeDistance === 1;
  const isAboveOperator =
    renderNode.activeDistance !== null &&
    renderNode.inActiveBranch &&
    renderNode.activeDistance === -1;

  const activeNodeIndex =
    activeNodeMeta?.type === 'group' ? activeNodeMeta.index : -1;

  // first operator in a group is hidden unless input is placed there.
  if (renderNode.index === 0) {
    if (activeNodeIndex !== 0 || !isActive) {
      return null;
    }
  }

  return (
    <QueryPartContainer
      onClick={(evt) => {
        setActiveNodeMeta({
          type: 'group',
          nodeId: renderNode.node.id,
          index: renderNode.index,
        });
        evt.stopPropagation();
      }}
      style={{
        width: '36px',
        ...(isBelowOperator || isAboveOperator ? secondaryHighlight : {}),
      }}
      renderNode={renderNode}
    >
      {renderNode.node.operator.toUpperCase()}
    </QueryPartContainer>
  );
}

export default RenderGroupOperator;
