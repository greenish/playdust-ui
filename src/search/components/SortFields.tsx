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
  const sort = useRecoilValue(store.searchSort)
  const { initialized, nfts } = useRecoilValue(store.searchResults)
  const setSort = store.useSetSelectedSort()

  if (!initialized || !nfts.results.length) {
    return <></>
  }

  return (
    <RootContainer>
      <FormControl>
        <InputLabel>{sortLabel}</InputLabel>
        <Select
          size="small"
          value={sort.selectedIndex}
          label={sortLabel}
          onChange={(e) => {
            const nextIdx = e.target.value

            if (typeof nextIdx === 'number') {
              setSort(nextIdx)
            }
          }}
        >
          {sort.options.map(({ name }, idx) => (
            <MenuItem key={name} value={idx}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </RootContainer>
  )
}

export default SortFields
