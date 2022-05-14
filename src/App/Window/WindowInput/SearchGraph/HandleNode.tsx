import { Typography } from '@mui/material';
import React from 'react';
import { Handle, NodeProps, Position } from 'react-flow-renderer';
import HandleNodeDataType from './_types/HandleNodeDataType';

function HandleNode({ data }: NodeProps<HandleNodeDataType>) {
  return (
    <>
      <Typography fontSize={10}>{data.label || ''}</Typography>
      <Handle type="target" id="target" position={Position.Top} />
      <Handle type="source" id="source" position={Position.Top} />
    </>
  );
}

export default HandleNode;
