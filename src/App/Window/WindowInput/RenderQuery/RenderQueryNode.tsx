import React from 'react';
import { useRecoilValue } from 'recoil';
import searchQueryRenderNodeMetaAtom from './_atoms/searchQueryRenderNodeMetaAtom';
import QueryPartContainer from './_sharedComponents/QueryPartContainer';
import QueryPartDecorator from './_sharedComponents/QueryPartDecorator';
import QueryRenderNodeType from './_types/QueryRenderNodeType';

function RenderQueryNode({
  renderNode,
  children,
}: React.PropsWithChildren<{ renderNode: QueryRenderNodeType }>) {
  const { higlightBackground, renderLineBelow, renderLineAbove } =
    useRecoilValue(searchQueryRenderNodeMetaAtom(renderNode));

  return (
    <QueryPartContainer highlightBackground={higlightBackground}>
      {children}
      {renderLineBelow && <QueryPartDecorator position="below" />}
      {renderLineAbove && <QueryPartDecorator position="above" />}
    </QueryPartContainer>
  );
}

export default RenderQueryNode;
