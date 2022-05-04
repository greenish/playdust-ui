import styled from '@emotion/styled'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import searchStateAtom from '../../../_atoms/searchState'
import options from '../../../_helpers/sortOptions'
import useSetSortValue from '../../../_hooks/useSetSortValue'

const RootContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const sortLabel = 'Sort'

const SortFields = () => {
  const { sort } = useRecoilValue(searchStateAtom)
  const setSortValue = useSetSortValue()

  const found = useMemo(() => {
    if (!sort) {
      return options[0]
    }

    return options.find(
      (entry) =>
        entry.value.direction === sort.direction &&
        entry.value.field === sort.field
    )
  }, [options, sort])

  return (
    <RootContainer>
      <FormControl>
        <InputLabel>{sortLabel}</InputLabel>
        <Select
          size="small"
          value={found?.name}
          label={sortLabel}
          onChange={(evt) => {
            const sortName = evt.target.value
            const found = options.find((entry) => entry.name === sortName)

            if (found) {
              setSortValue(found.value)
            }
          }}
        >
          {options.map(({ name }) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </RootContainer>
  )
}

export default SortFields
