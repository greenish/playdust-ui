import styled from '@emotion/styled';
import { Tooltip } from '@mui/material';
import React from 'react';
import { useRecoilValue } from 'recoil';
import searchQueryActiveNodeMetaAtom from '../../../../_atoms/searchQueryActiveNodeMetaAtom';
import searchQuerySelectedNodesAtom from '../../_atoms/searchQuerySelectedNodesAtom';
import QueryPartContainer from '../_sharedComponents/QueryPartContainer';
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
  renderChipInput: () => JSX.Element;
  renderNode: GroupRenderNodeType | GroupRenderOperatorNodeType;
};

function RenderInput({ renderChipInput, renderNode }: RenderInputProps) {
  const toggleGroupOperator = useToggleGroupOperator();
  const selectedNodes = useRecoilValue(searchQuerySelectedNodesAtom);
  const activeNodeMeta = useRecoilValue(searchQueryActiveNodeMetaAtom);

  const [operator, oppositeOperator] =
    renderNode.node.operator === 'and' ? ['AND', 'OR'] : ['OR', 'AND'];

  if (
    selectedNodes.length > 0 ||
    (activeNodeMeta?.type === 'group' &&
      activeNodeMeta.isGroupSelected === true)
  ) {
    return null;
  }

  return (
    <QueryPartContainer
      highlightBackground={selectedNodes.length > 0}
      renderNode={renderNode}
    >
      <Tooltip title={`Toggle ${operator} to ${oppositeOperator}`}>
        <InputOperator
          onClick={() => {
            toggleGroupOperator(renderNode.node.id);
          }}
        >{`${operator}:`}</InputOperator>
      </Tooltip>
      {renderChipInput()}
    </QueryPartContainer>
  );
}

export default RenderInput;
