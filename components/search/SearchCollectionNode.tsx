import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { useRecoilValue } from 'recoil'
import { MetaplexCollectionIdentifier } from '../../solana/types'
import * as store from '../../store'

const label = 'is:'

interface SearchCollectionNodeProps {
  id: string
}

const SearchCollectionNode = (props: SearchCollectionNodeProps) => {
  const data = useRecoilValue(store.searchQueryChild(props.id))
  const value = data.value as MetaplexCollectionIdentifier

  return (
    <FormControl fullWidth sx={{ mt: 1 }}>
      <InputLabel>{label}</InputLabel>
      <Select value={value.name} label={label} readOnly>
        <MenuItem value={value.name}>{value.name}</MenuItem>
      </Select>
    </FormControl>
  )
}

export default SearchCollectionNode
