import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import { useUpdateAttributeNode } from '../../hooks/useSearchChange'
import * as store from '../../store'

const traitLabel = 'is trait'
const valueLabel = 'equals'

interface AttributeNodeProps {
  id: string
}

const AttributeNode = (props: AttributeNodeProps) => {
  const data = useRecoilValue(store.searchQueryAttribute(props.id))
  const updateAttributeNode = useUpdateAttributeNode('memory')
  const attributes = store.useNoWaitSearchAttributes()

  const options = useMemo(() => {
    const base =
      attributes.find((entry) => entry.trait === data.trait)?.options || []
    const withValue = [...data.value, ...base]

    return [...new Set(withValue)]
  }, [attributes, data.trait])

  const isAttributeValueSearch = !(data.trait === '' && data.value.length > 0)

  return (
    <>
      <FormControl fullWidth sx={{ mt: 1 }}>
        {isAttributeValueSearch && (
          <>
            <InputLabel>{traitLabel}</InputLabel>
            <Select
              value={data.trait || ''}
              label={traitLabel}
              onChange={(evt) =>
                updateAttributeNode({
                  id: props.id,
                  update: { trait: evt.target.value },
                })
              }
            >
              {attributes.map((attribute) => (
                <MenuItem key={attribute.trait} value={attribute.trait}>
                  {attribute.trait}
                </MenuItem>
              ))}
            </Select>
          </>
        )}
      </FormControl>
      <FormControl fullWidth sx={{ mt: 1 }}>
        <InputLabel>{valueLabel}</InputLabel>
        <Select
          multiple
          disabled={!options.length || data.value.length === options.length}
          label={valueLabel}
          value={data.value || []}
          onChange={(evt) =>
            updateAttributeNode({
              id: props.id,
              update: {
                value: evt.target.value as string[],
              },
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

export default AttributeNode
