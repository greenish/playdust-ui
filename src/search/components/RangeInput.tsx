import styled from '@emotion/styled'
import { Check } from '@mui/icons-material'
import { IconButton, TextField, Typography } from '@mui/material'
import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import { SearchFilterFields } from '../store'
import { RangeContent } from '../types/ComposedQueryType'

interface RangeInputProps {
  value: SearchFilterFields
  min: number | undefined
  max: number | undefined
  onApply: (newValue: Omit<RangeContent, 'field'>) => any
  sol?: boolean
}

interface RangeTextFieldProps {
  value: number | undefined
  label: string
  setter: Dispatch<SetStateAction<number | undefined>>
  sol?: boolean
}

const RootContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const RangeTextField = ({ value, label, setter, sol }: RangeTextFieldProps) => {
  return (
    <TextField
      label={label}
      placeholder={sol ? 'SOL' : ''}
      size="small"
      type="number"
      value={value === undefined ? '' : value}
      onChange={(evt) => {
        const parsed = parseFloat(evt.target.value)

        if (isNaN(parsed)) {
          return setter(undefined)
        }

        setter(parseFloat(evt.target.value))
      }}
    />
  )
}

const RangeInput = (props: RangeInputProps) => {
  const { value, onApply } = props
  const [min, setMin] = useState(props.min)
  const [max, setMax] = useState(props.max)

  const disabled = useMemo(() => {
    if (min === undefined || max === undefined) {
      return true
    }

    return !(min >= 0 && max > 0 && min < max)
  }, [min, max])

  return (
    <RootContainer>
      <RangeTextField label="min" value={min} setter={setMin} sol={props.sol} />
      <Typography sx={{ mx: 1 }}>to</Typography>
      <RangeTextField label="max" value={max} setter={setMax} sol={props.sol} />
      <IconButton
        sx={{ ml: 1 }}
        disabled={disabled}
        onClick={() => onApply({ min: min!, max: max!, value })}
      >
        <Check />
      </IconButton>
    </RootContainer>
  )
}

export default RangeInput
