import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { useRecoilValue } from 'recoil'
import * as store from '../../store'

const label = 'is:'

interface SearchCollectionProps {
  id: string
}

const SearchCollection = (props: SearchCollectionProps) => {
  const { value } = useRecoilValue(store.searchQueryChild(props.id))

  return (
    <FormControl fullWidth sx={{ mt: 1 }}>
      <InputLabel>{label}</InputLabel>
      <Select value={value || ''} label={label} readOnly>
        <MenuItem value={value}>{value}</MenuItem>
      </Select>
    </FormControl>
  )
}

export default SearchCollection
