import styled from '@emotion/styled';
import React, { Fragment } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import QueryNodeType from '../../../../_types/QueryNodeType';
import searchQueryActiveNodeAtom from '../_atoms/searchQueryActiveNodeAtom';
import GroupNodeType from '../_types/GroupNodeType';
import RenderGroupEnds from './RenderGroupEnds';
import RenderGroupOperator from './RenderGroupOperator';
import RenderInput from './RenderInput/RenderInput';
import RenderQueryNode from './RenderQueryNode';
import searchQueryRenderMapAtom from './_atoms/searchQueryRenderMapAtom';

const QueryGroup = styled.div`
  display: flex;
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
  const [activeNode] = useRecoilState(searchQueryActiveNodeAtom);
  const groupedRenderMap = useRecoilValue(searchQueryRenderMapAtom);

  return (
    <>
      {groupedRenderMap.map((renderMap) => (
        <QueryGroup key={renderMap.map((entry) => entry.node.id).join(':')}>
          {renderMap.map((renderNode) => {
            const key = `${renderNode.type}:${renderNode.node.id}`;

            switch (renderNode.type) {
              case 'groupStart':
                return <RenderGroupEnds key={key} renderNode={renderNode} />;
              case 'groupEnd':
                return (
                  <Fragment key={key}>
                    {activeNode?.type === 'group' &&
                      activeNode?.nodeId === renderNode.node.id &&
                      activeNode?.index === renderNode.node.children.length && (
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
                    {activeNode?.type === 'group' &&
                      activeNode?.nodeId === renderNode.node.id &&
                      activeNode?.index === renderNode.index && (
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
