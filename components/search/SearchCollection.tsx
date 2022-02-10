import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { useRecoilValue } from 'recoil'
import { cannedCollections } from '../../solana'
import * as store from '../../store'

const label = 'is:'

interface SearchCollectionProps {
  id: string
}

const SearchCollection = (props: SearchCollectionProps) => {
  const { value } = useRecoilValue(store.searchQueryChild(props.id))
  const updateChild = store.useUpdateChild()

  return (
    <FormControl fullWidth sx={{ mt: 1 }}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value || ''}
        label={label}
        onChange={(evt) => updateChild(props.id, { value: evt.target.value })}
      >
        {cannedCollections.map((entry) => (
          <MenuItem key={entry.name} value={entry.name}>
            {entry.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default SearchCollection
