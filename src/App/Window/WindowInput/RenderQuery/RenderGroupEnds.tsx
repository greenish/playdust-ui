import React from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import searchQueryActiveNodeMetaAtom from '../../_atoms/searchQueryActiveNodeMetaAtom';
import searchQueryRootNodeAtom from '../../_atoms/searchQueryRootNodeAtom';
import searchQueryRenderNodeMetaAtom from './_atoms/searchQueryRenderNodeMetaAtom';
import QueryPartContainer from './_sharedComponents/QueryPartContainer';
import QueryPartDecorator from './_sharedComponents/QueryPartDecorator';
import GroupRenderNodeType from './_types/GroupRenderNodeType';

const stylesStart = {
  paddingRight: '4px',
};

const stylesEnd = {
  paddingLeft: '4px',
};


function RenderGroupEnds({ renderNode }: { renderNode: GroupRenderNodeType }) {
  const setActiveNodeMeta = useSetRecoilState(searchQueryActiveNodeMetaAtom);
  const rootNode = useRecoilValue(searchQueryRootNodeAtom);
  const { higlightBackground, renderLineBelow, renderLineAbove, isActive } =
    useRecoilValue(searchQueryRenderNodeMetaAtom(renderNode));

  if (!rootNode) {
    return null;
  }

  const isRoot = rootNode.id === renderNode.node.id;

  if (isRoot) {
    return null;
  }

  const symbol = renderNode.type === 'groupStart' ? '(' : ')';
  const index =
    renderNode.type === 'groupStart' ? 0 : renderNode.node.children.length;

  return (
    <QueryPartContainer
      onClick={(evt) => {
        setActiveNodeMeta({
          type: 'group',
          nodeId: renderNode.node.id,
          index,
        });
        evt.stopPropagation();
      }}
      highlightBackground={higlightBackground}
      highlightColor={isActive}
      style={{
        ...(renderNode.type === 'groupStart' ? stylesStart : {}),
        ...(renderNode.type === 'groupEnd' ? stylesEnd : {}),
      }}
    >
      {!isRoot && symbol}
      {renderLineBelow && <QueryPartDecorator position="below" />}
      {renderLineAbove && <QueryPartDecorator position="above" />}
    </QueryPartContainer>
  );
}

export default RenderGroupEnds;
