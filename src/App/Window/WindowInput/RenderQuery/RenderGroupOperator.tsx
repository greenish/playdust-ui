import React from 'react';
import { useRecoilState } from 'recoil';
import searchQueryActiveNodeMetaAtom from '../../_atoms/searchQueryActiveNodeMetaAtom';
import QueryPartContainer from './_sharedComponents/QueryPartContainer';
import QueryPartDecorator from './_sharedComponents/QueryPartDecorator';
import GroupRenderOperatorNodeType from './_types/GroupRenderOperatorNodeType';

const operatorContainerStyles = {
  width: '36px',
};

const activeBackground = {
  background: 'rgb(255,0,0, 0.08)',
};

const secondaryHighlight = {
  color: 'rgb(180,180,180)',
  fontWeight: 'bold',
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
  const [activeNodeMeta, setActiveNodeMeta] = useRecoilState(
    searchQueryActiveNodeMetaAtom
  );

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
  const isActive =
    renderNode.activeDistance !== null &&
    renderNode.inActiveBranch &&
    renderNode.activeDistance === 0;

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
  const operator = renderNode.node.operator === 'and' ? 'AND' : 'OR';

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
        ...operatorContainerStyles,
        ...(isBelowActive ? activeBackground : {}),
        ...(isActive ? activeOperatorStyles : {}),
        ...(isBelowOperator ? secondaryHighlight : {}),
        ...(isAboveOperator ? secondaryHighlight : {}),
      }}
    >
      {operator}
      {isAboveActive && <QueryPartDecorator position="below" />}
      {is2BelowActive && <QueryPartDecorator position="above" />}
    </QueryPartContainer>
  );
}

export default RenderGroupOperator;
