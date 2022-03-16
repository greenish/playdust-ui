import styled from '@emotion/styled'
import { Check } from '@mui/icons-material'
import { IconButton, TextField, Typography } from '@mui/material'
import { Dispatch, SetStateAction, useMemo, useState } from 'react'
import { RangeContent } from '../types/ComposedQueryType'

interface RangeInputProps {
  value: string
  min: number | undefined
  max: number | undefined
  onApply: (newValue: Omit<RangeContent, 'field'>) => any
}

interface RangeTextFieldProps {
  value: number | undefined
  label: string
  setter: Dispatch<SetStateAction<number | undefined>>
}

const RootContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const RangeTextField = ({ value, label, setter }: RangeTextFieldProps) => {
  return (
    <TextField
      label={label}
      placeholder="SOL"
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
    if (!min || !max) {
      return true
    }

    return !(min >= 0 && max > 0 && min < max)
  }, [min, max])

  return (
    <RootContainer>
      <RangeTextField label="min" value={min} setter={setMin} />
      <Typography sx={{ mx: 1 }}>to</Typography>
      <RangeTextField label="max" value={max} setter={setMax} />
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
