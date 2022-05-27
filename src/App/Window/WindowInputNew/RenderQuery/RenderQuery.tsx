import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import QueryNodeType from '../../../../_types/QueryNodeType';
import searchQueryActiveNodeAtom from '../_atoms/searchQueryActiveNodeAtom';
import GroupNodeType from '../_types/GroupNodeType';
import RenderGroupEnds from './RenderGroupEnds';
import RenderGroupOperator from './RenderGroupOperator';
import RenderInput from './RenderInput/RenderInput';
import RenderQueryNode from './RenderQueryNode';
import searchQueryRenderMapAtom from './_atoms/searchQueryRenderMapAtom';

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
  const searchQueryRenderMap = useRecoilValue(searchQueryRenderMapAtom);

  return (
    <>
      {searchQueryRenderMap.map((renderNode) => {
        switch (renderNode.type) {
          case 'groupStart':
            return <RenderGroupEnds renderNode={renderNode} />;
          case 'groupEnd':
            return (
              <>
                {activeNode?.type === 'group' &&
                  activeNode?.nodeId === renderNode.node.id &&
                  activeNode?.index === renderNode.node.children.length && (
                    <RenderInput
                      renderNode={renderNode}
                      renderTextInput={renderTextInput}
                    />
                  )}
                <RenderGroupEnds renderNode={renderNode} />
              </>
            );
          case 'groupOperator': {
            return (
              <>
                {activeNode?.type === 'group' &&
                  activeNode?.nodeId === renderNode.node.id &&
                  activeNode?.index === renderNode.index && (
                    <RenderInput
                      renderNode={renderNode}
                      renderTextInput={renderTextInput}
                    />
                  )}
                <RenderGroupOperator renderNode={renderNode} />
              </>
            );
          }
          case 'query':
            return (
              <RenderQueryNode renderNode={renderNode}>
                {renderQueryNode(renderNode.node, renderNode.parent)}
              </RenderQueryNode>
            );
          default:
            return null;
        }
      })}
    </>
  );
}

export default RenderQuery;
