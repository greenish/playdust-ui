import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { useRecoilValue } from 'recoil'
import * as store from '../store'
import { CollectionQuery } from '../types/ComposedQueryType'

const label = 'is:'

interface SearchCollectionNodeProps {
  id: string
}

const SearchCollectionNode = (props: SearchCollectionNodeProps) => {
  const { value } = useRecoilValue(
    store.searchQueryChild(props.id)
  ) as CollectionQuery

  return (
    <FormControl fullWidth sx={{ mt: 1 }}>
      <InputLabel>{label}</InputLabel>
      <Select value={value} label={label} readOnly>
        <MenuItem value={value}>{value}</MenuItem>
      </Select>
    </FormControl>
  )
}

export default SearchCollectionNode
