import styled from '@emotion/styled'
import { ArrowDownward, ArrowForward } from '@mui/icons-material'
import { Button, Card, Menu, MenuItem, MenuItemProps } from '@mui/material'
import { useState } from 'react'
import { NodeComponentProps } from 'react-flow-renderer'
import useAddAttributeQueryNode from '../../_hooks/useAddAttributeQueryNode'

const RoootContainer = styled(Card)`
  display: flex;
`

const ActionNode = ({ data }: NodeComponentProps) => {
  const [operation] = useState<'and' | 'or'>('and')
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement>()
  const addAttributeQueryNode = useAddAttributeQueryNode('memory')

  const open = !!anchorEl
  const onClose = () => {
    setAnchorEl(undefined)
  }

  const MenuItemHandler = ({ onClick, ...props }: MenuItemProps) => (
    <MenuItem
      {...props}
      onClick={(evt) => {
        onClick && onClick(evt)
        onClose()
      }}
    />
  )

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
        >
          Attribute Exact
        </MenuItemHandler>
      </Menu>
      {!data.disableOr && (
        <Button
          size="small"
          fullWidth
          endIcon={<ArrowDownward />}
          onClick={() => {
            addAttributeQueryNode({
              value: [],
              trait: '',
              operation: 'or',
              at: data.idx,
            })
          }}
        >
          OR
        </Button>
      )}
      <Button
        fullWidth
        size="small"
        endIcon={<ArrowForward />}
        onClick={() => {
          addAttributeQueryNode({
            value: [],
            trait: '',
            operation: 'and',
            at: data.idx,
          })
        }}
      >
        AND
      </Button>
    </RoootContainer>
  )
}

export default ActionNode
