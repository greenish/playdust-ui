import styled from '@emotion/styled';
import { Tooltip } from '@mui/material';
import React from 'react';
import { useRecoilValue } from 'recoil';
import GroupNodeType from '../../../_types/GroupNodeType';
import searchQuerySelectedNodesAtom from '../../_atoms/searchQuerySelectedNodesAtom';
import searchQueryRenderNodeMetaAtom from '../_atoms/searchQueryRenderNodeMetaAtom';
import QueryPartContainer from '../_sharedComponents/QueryPartContainer';
import QueryPartDecorator from '../_sharedComponents/QueryPartDecorator';
import GroupRenderNodeType from '../_types/GroupRenderNodeType';
import GroupRenderOperatorNodeType from '../_types/GroupRenderOperatorNodeType';
import useToggleGroupOperator from './_hooks/useToggleGroupOperator';

const InputOperator = styled.div`
  font-weight: bold;
  display: flex;
  justify-content: center;
  width: 36px;
  cursor: pointer;
`;

type RenderInputProps = {
  renderTextInput: (
    groupNode: GroupNodeType,
    groupIndex: number
  ) => JSX.Element | null;
  renderNode: GroupRenderNodeType | GroupRenderOperatorNodeType;
};

function RenderInput({ renderTextInput, renderNode }: RenderInputProps) {
  const toggleGroupOperator = useToggleGroupOperator();
  const { renderLineBelow } = useRecoilValue(
    searchQueryRenderNodeMetaAtom(renderNode)
  );
  const selectedNodes = useRecoilValue(searchQuerySelectedNodesAtom);

  const [operator, oppositeOperator] =
    renderNode.node.operator === 'and' ? ['AND', 'OR'] : ['OR', 'AND'];
  const index =
    renderNode.type === 'groupOperator'
      ? renderNode.index
      : renderNode.node.children.length;

  return (
    <QueryPartContainer
      onClick={(e) => {
        toggleGroupOperator(renderNode.node.id);
        e.stopPropagation();
      }}
      highlightBackground={selectedNodes.length > 0}
    >
      <Tooltip title={`Toggle ${operator} to ${oppositeOperator}`}>
        <InputOperator>{`${operator}:`}</InputOperator>
      </Tooltip>
      {renderTextInput(renderNode.node, index)}
      {renderLineBelow && <QueryPartDecorator position="below" />}
    </QueryPartContainer>
  );
}

export default RenderInput;
