import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { useRecoilValue, useRecoilValueLoadable } from 'recoil'
import * as store from '../../store'
import { CollectionQuery } from '../../types/ComposedQueryType'

const label = 'is:'

interface CollectionNodeProps {
  id: string
}

const CollectionNode = (props: CollectionNodeProps) => {
  const { value } = useRecoilValue(
    store.searchQueryChild(props.id)
  ) as CollectionQuery
  const { state, contents } = useRecoilValueLoadable(
    store.collectionById(value)
  )
  const collectionName =
    state === 'hasValue' ? contents.name || contents.symbol : value

  return (
    <FormControl fullWidth sx={{ mt: 1 }}>
      <InputLabel>{label}</InputLabel>
      <Select value={value} label={label} readOnly>
        <MenuItem value={value}>{collectionName}</MenuItem>
      </Select>
    </FormControl>
  )
}

export default CollectionNode
