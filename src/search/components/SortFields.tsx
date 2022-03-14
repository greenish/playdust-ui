import styled from '@emotion/styled'
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { useRecoilValue } from 'recoil'
import * as store from '../store'

const RootContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const sortLabel = 'Sort'

const SortFields = () => {
  const selected = useRecoilValue(store.searchSortSelected)
  const { initialized, nfts } = useRecoilValue(store.searchResults)
  const setSort = store.useSetSelectedSort()
  const options = useRecoilValue(store.searchSortVisibleOptions)

  if (!initialized || !nfts.results.length) {
    return <></>
  }

  return (
    <RootContainer>
      <FormControl>
        <InputLabel>{sortLabel}</InputLabel>
        <Select
          size="small"
          value={selected.name}
          label={sortLabel}
          onChange={(evt) => {
            setSort(evt.target.value)
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
