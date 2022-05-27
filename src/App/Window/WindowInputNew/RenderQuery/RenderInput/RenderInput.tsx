import styled from '@emotion/styled';
import React from 'react';
import { useSetRecoilState } from 'recoil';
import GroupNodeType from '../../_types/GroupNodeType';
import GroupRenderNodeType from '../_types/GroupRenderNodeType';
import GroupRenderOperatorNodeType from '../_types/GroupRenderOperatorNodeType';
import searchQueryNodeAtom from './_atoms/searchQueryNodeAtom';

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0px 4px;
`;
const InputOperator = styled.div`
  font-weight: bold;
`;
const aboveActiveOperatorStyles = {
  borderWidth: '7px solid rgb(200,200,200)',
  marginBottom: '-11px',
  paddingBottom: '4px',
};

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
  const { isAboveActive } = renderNode.nodeState;

  const operator = renderNode.node.operator === 'and' ? 'AND' : 'OR';
  const index =
    renderNode.type === 'groupOperator'
      ? renderNode.index
      : renderNode.node.children.length;

  return (
    <InputContainer
      onClick={(e) => e.stopPropagation()}
      style={{
        ...(isAboveActive ? aboveActiveOperatorStyles : {}),
      }}
    >
      <InputOperator
        onClick={(evt) => {
          setGroupNode({
            ...renderNode.node,
            operator: renderNode.node.operator === 'and' ? 'or' : 'and',
          });
          evt.stopPropagation();
        }}
        style={{ paddingRight: '4px' }}
      >
        {`${operator}:`}
      </InputOperator>
      {renderTextInput(renderNode.node, index)}
    </InputContainer>
  );
}

export default RenderInput;
