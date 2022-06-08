import styled from '@emotion/styled';
import { Tooltip } from '@mui/material';
import React from 'react';
import GroupNodeType from '../../../_types/GroupNodeType';
import QueryPartContainer from '../_sharedComponents/QueryPartContainer';
import QueryPartDecorator from '../_sharedComponents/QueryPartDecorator';
import GroupRenderNodeType from '../_types/GroupRenderNodeType';
import GroupRenderOperatorNodeType from '../_types/GroupRenderOperatorNodeType';
import useToggleGroupOperator from './_hooks/useToggleGroupOperator';

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
  const toggleGroupOperator = useToggleGroupOperator();
  const isAboveActive =
    renderNode.activeDistance !== null && renderNode.activeDistance >= 0;

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
    >
      <Tooltip title={`Toggle ${operator} to ${oppositeOperator}`}>
        <InputOperator
          style={{
            display: 'flex',
            justifyContent: 'center',
            width: '36px',
            cursor: 'pointer',
          }}
        >
          {`${operator}:`}
        </InputOperator>
      </Tooltip>
      {renderTextInput(renderNode.node, index)}
      {isAboveActive && <QueryPartDecorator position="below" />}
    </QueryPartContainer>
  );
}

export default RenderInput;
