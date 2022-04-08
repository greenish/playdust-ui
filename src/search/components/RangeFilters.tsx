import styled from '@emotion/styled'
import { Checkbox, FormControlLabel } from '@mui/material'
import { useMemo, useState } from 'react'
import { useRecoilValue } from 'recoil'
import * as store from '../store'
import RangeInput from './RangeInput'

const ItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px 0;
`

const CheckboxContainer = styled.div`
  margin-left: 4px;
`

const RangeFilter = ({ label, name }: store.SearchFilter) => {
  const addRange = store.useAddRange()
  const removeChild = store.useRemoveChild()
  const queryValue = useRecoilValue(store.rangeQueryByName(name))
  const updateRange = store.useUpdateRange()

  const [local, setLocal] = useState({
    visible: false,
    min: 0,
    max: 0,
  })

  const { visible, setVisible, min, max, onApply } = useMemo(() => {
    if (!!queryValue) {
      return {
        visible: true,
        min: queryValue.min,
        max: queryValue.max,
        setVisible: () => removeChild(queryValue.id),
        onApply: updateRange(queryValue.id),
      }
    }

    return {
      visible: local.visible,
      min: undefined,
      max: undefined,
      setVisible: (visible: boolean) => setLocal({ ...local, visible }),
      onApply: addRange,
    }
  }, [local, queryValue])

  return (
    <ItemContainer key={name}>
      <CheckboxContainer>
        <FormControlLabel
          control={
            <Checkbox
              checked={visible}
              size="small"
              onChange={() => setVisible(!visible)}
            />
          }
          label={label}
        />
      </CheckboxContainer>
      {visible && (
        <RangeInput
          min={min}
          max={max}
          value={name}
          onApply={onApply}
          sol={name !== 'rarity-score'}
        />
      )}
    </ItemContainer>
  )
}

const RangeFilters = () => {
  const filters = useRecoilValue(store.searchFilters)

  return (
    <>
      {filters.map((filter) => (
        <RangeFilter key={filter.name} {...filter} />
      ))}
    </>
  )
}

export default RangeFilters
