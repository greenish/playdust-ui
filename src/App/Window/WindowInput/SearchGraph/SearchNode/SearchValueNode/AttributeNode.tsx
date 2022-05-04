import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import searchAggregationsAtom from '../../../../_atoms/searchAggregations'
import searchQueryAttributeAtom from '../../../../_atoms/searchQueryAttribute'
import useUpdateAttributeQueryNode from '../../../../_hooks/useUpdateAttributeQueryNode'

const traitLabel = 'is trait'
const valueLabel = 'equals'

interface AttributeNodeProps {
  id: string
}

const AttributeNode = (props: AttributeNodeProps) => {
  const data = useRecoilValue(searchQueryAttributeAtom(props.id))
  const updateAttributeQueryNode = useUpdateAttributeQueryNode('memory')
  const { attributes } = useRecoilValue(searchAggregationsAtom)

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
                updateAttributeQueryNode({
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
            updateAttributeQueryNode({
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
