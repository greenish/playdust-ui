import styled from '@emotion/styled';
import React from 'react';
import { useSetRecoilState } from 'recoil';
import GroupNodeType from '../../_types/GroupNodeType';
import QueryPartContainer from '../_sharedComponents/QueryPartContainer';
import QueryPartDecorator from '../_sharedComponents/QueryPartDecorator';
import GroupRenderNodeType from '../_types/GroupRenderNodeType';
import GroupRenderOperatorNodeType from '../_types/GroupRenderOperatorNodeType';
import searchQueryNodeAtom from './_atoms/searchQueryNodeAtom';

const InputOperator = styled.div`
  font-weight: bold;
`;

type RenderInputProps = {
  renderTextInput: (
    groupNode: GroupNodeType,
    groupIndex: number
  ) => JSX.Element | null;
  renderNode: GroupRenderNodeType | GroupRenderOperatorNodeType;
};

function RenderInput({ renderTextInput, renderNode }: RenderInputProps) {
  const setGroupNode = useSetRecoilState(
    searchQueryNodeAtom(renderNode.node.id)
  );

  const isAboveActive =
    renderNode.activeDistance !== null && renderNode.activeDistance >= 0;

  const operator = renderNode.node.operator === 'and' ? 'AND' : 'OR';
  const index =
    renderNode.type === 'groupOperator'
      ? renderNode.index
      : renderNode.node.children.length;

  return (
    <QueryPartContainer onClick={(e) => e.stopPropagation()}>
      <InputOperator
        onClick={(evt) => {
          setGroupNode({
            ...renderNode.node,
            operator: renderNode.node.operator === 'and' ? 'or' : 'and',
          });
          evt.stopPropagation();
        }}
        style={{
          display: 'flex',
          justifyContent: 'center',
          width: '36px',
        }}
      >
        {`${operator}:`}
      </InputOperator>
      {renderTextInput(renderNode.node, index)}
      {isAboveActive && <QueryPartDecorator position="below" />}
    </QueryPartContainer>
  );
}

export default RenderInput;
