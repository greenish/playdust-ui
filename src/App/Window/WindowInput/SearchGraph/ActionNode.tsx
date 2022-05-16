import styled from '@emotion/styled';
import { ArrowDownward, ArrowForward } from '@mui/icons-material';
import { Button, Card, Menu, MenuItem, MenuItemProps } from '@mui/material';
import React, { useState } from 'react';
import { NodeComponentProps } from 'react-flow-renderer';
import type QueryOperationUnionType from '../../../../_types/QueryOperationUnionType';
import useAddAttributeQueryNode from '../../_hooks/useAddAttributeQueryNode';
import ActionNodeDataType from './_types/ActionNodeDataType';

const RoootContainer = styled(Card)`
  display: flex;
`;

interface MenuItemHandlerProps extends MenuItemProps {
  onClose: () => void;
}

function MenuItemHandler({ onClick, onClose, ...props }: MenuItemHandlerProps) {
  return (
    <MenuItem
      {...props}
      onClick={(evt) => {
        if (onClick) {
          onClick(evt);
        }
        onClose();
      }}
    />
  );
}

function ActionNode({ data }: NodeComponentProps<ActionNodeDataType>) {
  const [operation] = useState<QueryOperationUnionType>('and');
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement>();
  const addAttributeQueryNode = useAddAttributeQueryNode('memory');

  const open = !!anchorEl;
  const onClose = () => {
    setAnchorEl(undefined);
  };

  return (
    <RoootContainer sx={{ width: data.width }}>
      <Menu open={open} anchorEl={anchorEl} onClose={onClose}>
        <MenuItemHandler
          onClick={() =>
            addAttributeQueryNode({
              value: [],
              trait: '',
              operation,
              at: data.idx,
            })
          }
          onClose={onClose}
        >
          Attribute Exact
        </MenuItemHandler>
      </Menu>
      {!data.disableOr && (
        <Button
          size="small"
          fullWidth={true}
          endIcon={<ArrowDownward />}
          onClick={() => {
            addAttributeQueryNode({
              value: [],
              trait: '',
              operation: 'or',
              at: data.idx,
            });
          }}
        >
          OR
        </Button>
      )}
      <Button
        fullWidth={true}
        size="small"
        endIcon={<ArrowForward />}
        onClick={() => {
          addAttributeQueryNode({
            value: [],
            trait: '',
            operation: 'and',
            at: data.idx,
          });
        }}
      >
        AND
      </Button>
    </RoootContainer>
  );
}

export default ActionNode;
