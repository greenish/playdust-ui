import styled from '@emotion/styled'
import { Checkbox, FormControlLabel } from '@mui/material'
import { useMemo, useState } from 'react'
import { useRecoilValue } from 'recoil'
import {
  useAddRangeNode,
  useRemoveNode,
  useUpdateRangeNode,
} from '../hooks/useSearchChange'
import * as store from '../store'
import RangeInput from './RangeInput'

const ItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 8px;
`

const CheckboxContainer = styled.div`
  margin-left: 4px;
`

const RangeFilter = ({ label, name }: store.SearchFilter) => {
  const addRangeNode = useAddRangeNode()
  const removeNode = useRemoveNode()
  const queryValue = useRecoilValue(store.rangeQueryByName(name))
  const updateRangeNode = useUpdateRangeNode()

  const [local, setLocal] = useState({
    visible: false,
    min: 0,
    max: 0,
  })

  const { visible, setVisible, min, max } = useMemo(() => {
    if (!!queryValue) {
      return {
        visible: true,
        min: queryValue.min,
        max: queryValue.max,
        setVisible: () => removeNode(queryValue.id),
      }
    }

    return {
      visible: local.visible,
      min: undefined,
      max: undefined,
      setVisible: (visible: boolean) => setLocal({ ...local, visible }),
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
          onApply={(newValue) =>
            queryValue
              ? updateRangeNode({ id: queryValue.id, update: newValue })
              : addRangeNode(newValue)
          }
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
