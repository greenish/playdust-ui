import styled from '@emotion/styled';
import { Close } from '@mui/icons-material';
import { Card, CardContent, IconButton, Typography } from '@mui/material';
import React, { CSSProperties } from 'react';
import { Handle, NodeComponentProps, Position } from 'react-flow-renderer';
import { useRecoilValue } from 'recoil';
import type QueryNodeType from '../../../../../_types/QueryNodeType';
import useRemoveQueryNode from '../../../_hooks/useRemoveQueryNode';
import SearchValueNode from './SearchValueNode/SearchValueNode';
import searchQueryChildAtom from './_atoms/searchQueryChildAtom';

const CloseContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -8px;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

const getStyle = (show: boolean): Partial<CSSProperties> => ({
  visibility: show ? 'visible' : 'hidden',
});

const getTitle = (query: QueryNodeType) => {
  switch (query.field) {
    case 'text':
      return 'Search by:';
    case 'range':
      return `Filter by ${query.value} (SOL):`;
    default:
      return query.field
        .match(/[A-Za-z][a-z]*/g)
        ?.map(
          ([firstLetter, ...rest]) =>
            `${firstLetter.toUpperCase()}${rest.join('')}`
        )
        .join(' ');
  }
};

function SearchNode({ id, data }: NodeComponentProps) {
  const removeQueryNode = useRemoveQueryNode('memory');
  const query = useRecoilValue(searchQueryChildAtom(id));
  const handles = data?.handles || {};

  if (!query) {
    return null;
  }

  return (
    <>
      <Card sx={{ width: data.width, height: data.height }}>
        <CardContent sx={{ width: '100%', height: '100%' }}>
          <CloseContainer>
            <Typography>{getTitle(query)}</Typography>
            <IconButton size="small" onClick={() => removeQueryNode(id)}>
              <Close fontSize="small" />
            </IconButton>
          </CloseContainer>
          <ContentContainer>
            <SearchValueNode id={id} />
          </ContentContainer>
        </CardContent>
      </Card>
      <Handle
        type="target"
        id="top"
        position={Position.Top}
        style={getStyle(handles.top)}
      />
      <Handle
        type="source"
        id="right"
        position={Position.Right}
        style={getStyle(handles.right)}
      />
      <Handle
        type="source"
        id="bottom"
        position={Position.Bottom}
        style={getStyle(handles.bottom)}
      />
      <Handle
        type="target"
        id="left"
        position={Position.Left}
        style={getStyle(handles.left)}
      />
    </>
  );
}

export default SearchNode;
