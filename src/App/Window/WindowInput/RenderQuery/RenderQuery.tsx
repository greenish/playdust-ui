import styled from '@emotion/styled';
import React, { Fragment } from 'react';
import { useRecoilValue } from 'recoil';
import searchQueryActiveNodeMetaAtom from '../../_atoms/searchQueryActiveNodeMetaAtom';
import GroupNodeType from '../../_types/GroupNodeType';
import QueryNodeType from '../../_types/QueryNodeType';
import RenderGroupEnds from './RenderGroupEnds';
import RenderGroupOperator from './RenderGroupOperator';
import RenderInput from './RenderInput/RenderInput';
import RenderQueryNode from './RenderQueryNode';
import searchQueryRenderMapAtom from './_atoms/searchQueryRenderMapAtom';

const QueryGroup = styled.div`
  display: flex;
  padding: 8px 0;
  flex-wrap: no-wrap;
`;

type RenderQueryProps = {
  renderTextInput: (
    groupNode: GroupNodeType,
    groupIndex: number
  ) => JSX.Element | null;
  renderQueryNode: (
    queryNode: QueryNodeType,
    groupNode: GroupNodeType
  ) => JSX.Element | null;
};

function RenderQuery({ renderTextInput, renderQueryNode }: RenderQueryProps) {
  const activeNodeMeta = useRecoilValue(searchQueryActiveNodeMetaAtom);
  const groupedRenderMap = useRecoilValue(searchQueryRenderMapAtom);

  return (
    <>
      {groupedRenderMap.map((renderMap) => (
        <QueryGroup key={renderMap.map((entry) => entry.node.id).join(':')}>
          {renderMap.map((renderNode) => {
            const key = `${renderNode.type}:${renderNode.node.id}`;
            const shouldRenderTextInput =
              activeNodeMeta?.type === 'group' &&
              activeNodeMeta?.nodeId === renderNode.node.id;

            switch (renderNode.type) {
              case 'groupStart':
                return <RenderGroupEnds key={key} renderNode={renderNode} />;
              case 'groupEnd':
                return (
                  <Fragment key={key}>
                    {shouldRenderTextInput &&
                      activeNodeMeta?.index ===
                        renderNode.node.children.length && (
                        <RenderInput
                          renderNode={renderNode}
                          renderTextInput={renderTextInput}
                        />
                      )}
                    <RenderGroupEnds renderNode={renderNode} />
                  </Fragment>
                );
              case 'groupOperator': {
                return (
                  <Fragment key={key}>
                    {shouldRenderTextInput &&
                      activeNodeMeta?.index === renderNode.index && (
                        <RenderInput
                          renderNode={renderNode}
                          renderTextInput={renderTextInput}
                        />
                      )}
                    <RenderGroupOperator renderNode={renderNode} />
                  </Fragment>
                );
              }
              case 'query':
                return (
                  <RenderQueryNode key={key} renderNode={renderNode}>
                    {renderQueryNode(renderNode.node, renderNode.parent)}
                  </RenderQueryNode>
                );
              default:
                return null;
            }
          })}
        </QueryGroup>
      ))}
    </>
  );
}

export default RenderQuery;
