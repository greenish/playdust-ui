import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import * as store from '../../store'

const traitLabel = 'is trait'
const valueLabel = 'equals'

interface SearchAttributeProps {
  id: string
}

const SearchAttribute = (props: SearchAttributeProps) => {
  const attributes = useRecoilValue(store.searchAttributes)
  const data = useRecoilValue(store.searchQueryExactAttribute(props.id))
  const updateExactAttribute = store.useUpdateExactAttribute()

  const options = useMemo(() => {
    return attributes.find((entry) => entry.trait === data.trait)?.options || []
  }, [attributes, data.trait])

  return (
    <>
      <FormControl fullWidth sx={{ mt: 1 }}>
        <InputLabel>{traitLabel}</InputLabel>
        <Select
          value={data.trait || ''}
          label={traitLabel}
          onChange={(evt) =>
            updateExactAttribute(props.id, { trait: evt.target.value })
          }
        >
          {attributes.map((attribute) => (
            <MenuItem key={attribute.trait} value={attribute.trait}>
              {attribute.trait}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth sx={{ mt: 1 }}>
        <InputLabel>{valueLabel}</InputLabel>
        <Select
          multiple
          disabled={!options.length}
          label={valueLabel}
          value={data.value || []}
          onChange={(evt) =>
            updateExactAttribute(props.id, {
              value: evt.target.value as string[],
            })
          }
        >
          {options.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  )
}

export default SearchAttribute
