import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import searchQueryActiveNodeAtom from '../_atoms/searchQueryActiveNodeAtom';
import searchQueryRootNodeAtom from '../_atoms/searchQueryRootNodeAtom';
import QueryPartContainer from './_sharedComponents/QueryPartContainer';
import QueryPartDecorator from './_sharedComponents/QueryPartDecorator';
import GroupRenderNodeType from './_types/GroupRenderNodeType';

const stylesStart = {
  paddingRight: '4px',
};

const stylesEnd = {
  paddingLeft: '4px',
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
  const [, setActiveNode] = useRecoilState(searchQueryActiveNodeAtom);
  const rootNode = useRecoilValue(searchQueryRootNodeAtom);
  const isRoot = rootNode.id === renderNode.node.id;

  if (isRoot) {
    return null;
  }

  const isAboveActive =
    renderNode.activeDistance !== null && renderNode.activeDistance >= 0;
  const isBelowActive =
    renderNode.activeDistance !== null &&
    renderNode.activeDistance >= 1 &&
    renderNode.inActiveBranch;
  const is2BelowActive =
    renderNode.activeDistance !== null &&
    renderNode.activeDistance >= 2 &&
    renderNode.inActiveBranch;
  const isActive =
    renderNode.activeDistance !== null &&
    renderNode.activeDistance === 0 &&
    renderNode.inActiveBranch;

  const symbol = renderNode.type === 'groupStart' ? '(' : ')';
  const index =
    renderNode.type === 'groupStart' ? 0 : renderNode.node.children.length;

  return (
    <QueryPartContainer
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
        ...(isBelowActive ? activeBackground : {}),
        ...(isActive ? stylesActive : {}),
      }}
    >
      {!isRoot && symbol}
      {isAboveActive && <QueryPartDecorator position="below" />}
      {is2BelowActive && <QueryPartDecorator position="above" />}
    </QueryPartContainer>
  );
}

export default RenderGroupEnds;
