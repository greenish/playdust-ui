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
  const aggregations = useRecoilValue(store.searchAggregations)
  const data = useRecoilValue(store.searchQueryChild(props.id))
  const updateChild = store.useUpdateChild()

  const attributes = useMemo(
    () =>
      aggregations.flatMap((entry) =>
        entry.attributes.map((attribute) => ({
          ...attribute,
          trait: `${entry.identifier.symbol}:${attribute.trait}`,
        }))
      ),
    [aggregations]
  )

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
          onChange={(evt) => updateChild(props.id, { trait: evt.target.value })}
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
          disabled={!options.length}
          label={valueLabel}
          value={data.value || ''}
          onChange={(evt) => updateChild(props.id, { value: evt.target.value })}
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
