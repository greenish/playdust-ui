import React from 'react';
import { useRecoilValue } from 'recoil';
import searchQueryRootNodeAtom from '../../../_atoms/searchQueryRootNodeAtom';
import QueryPartContainer from './_sharedComponents/QueryPartContainer';
import GroupRenderNodeType from './_types/GroupRenderNodeType';

const stylesStart = {
  paddingRight: '4px',
};

const stylesEnd = {
  paddingLeft: '4px',
};

function RenderGroupEnds({ renderNode }: { renderNode: GroupRenderNodeType }) {
  const rootNode = useRecoilValue(searchQueryRootNodeAtom);

  if (!rootNode) {
    return null;
  }

  const isRoot = rootNode.id === renderNode.node.id;

  if (isRoot) {
    return null;
  }

  const symbol = renderNode.type === 'groupStart' ? '(' : ')';

  return (
    <QueryPartContainer
      style={{
        ...(renderNode.type === 'groupStart' ? stylesStart : {}),
        ...(renderNode.type === 'groupEnd' ? stylesEnd : {}),
      }}
      renderNode={renderNode}
    >
      {!isRoot && symbol}
    </QueryPartContainer>
  );
}

export default RenderGroupEnds;
