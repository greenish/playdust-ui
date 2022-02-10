import styled from '@emotion/styled'
import { ArrowDownward, ArrowForward } from '@mui/icons-material'
import { Button, Card, Menu, MenuItem } from '@mui/material'
import { useState } from 'react'
import { NodeComponentProps } from 'react-flow-renderer'
import * as store from '../../store'
import { FieldType, SearchType } from '../../store/searchQuery'

const RoootContainer = styled(Card)`
  display: flex;
`

const options: {
  name: string
  field: FieldType
  searchType: SearchType
}[] = [
  {
    name: 'Collection Exact',
    field: 'collection',
    searchType: 'exact',
  },
  {
    name: 'Collection Relevance',
    field: 'collection',
    searchType: 'relevance',
  },
  {
    name: 'Attribute Exact',
    field: 'attribute',
    searchType: 'exact',
  },
  {
    name: 'Attribute Relevance',
    field: 'attribute',
    searchType: 'relevance',
  },
]

const ActionNode = ({ data }: NodeComponentProps) => {
  const addChild = store.useAddChild()
  const [operation, setOperation] = useState<'and' | 'or'>()
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement>()

  const open = !!anchorEl
  const onClose = () => {
    setAnchorEl(undefined)
    setOperation(undefined)
  }

  return (
    <RoootContainer sx={{ width: data.width }}>
      <Menu open={open} anchorEl={anchorEl} onClose={onClose}>
        {options.map((option) => (
          <MenuItem
            key={option.name}
            onClick={() => {
              if (operation) {
                addChild(data.idx, operation, option.searchType, option.field)
                onClose()
              }
            }}
          >
            {option.name}
          </MenuItem>
        ))}
      </Menu>
      <Button
        size="small"
        fullWidth
        endIcon={<ArrowDownward />}
        onClick={(evt) => {
          setOperation('or')
          setAnchorEl(evt.currentTarget)
        }}
      >
        OR
      </Button>
      <Button
        fullWidth
        size="small"
        endIcon={<ArrowForward />}
        onClick={(evt) => {
          setOperation('and')
          setAnchorEl(evt.currentTarget)
        }}
      >
        AND
      </Button>
    </RoootContainer>
  )
}

export default ActionNode
