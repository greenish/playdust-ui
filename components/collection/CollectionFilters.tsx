import styled from '@emotion/styled'
import {
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from '@mui/material'
import { useEffect } from 'react'
import { useRecoilValue, useResetRecoilState } from 'recoil'
import * as store from '../../store'

const RootContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const ItemContainer = styled.div`
  margin: 8px;
`

const ChipContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const ChipItem = styled.div`
  margin: 2px;
`

const CollectionFilters = () => {
  const { attributes } = useRecoilValue(store.fetchCollectionAggregation)
  const filters = useRecoilValue(store.collectionFilters)
  const resetFilters = useResetRecoilState(store.collectionFilters)
  const updateFilters = store.useUpdateCollectionFilters()

  useEffect(() => resetFilters, [])

  return (
    <RootContainer>
      <Typography sx={{ marginLeft: 1 }}>Filters</Typography>
      {attributes.map((attribute) => (
        <ItemContainer key={attribute.trait}>
          <FormControl fullWidth>
            <InputLabel>{attribute.trait}</InputLabel>
            <Select
              multiple
              value={
                filters.find((entry) => entry.trait === attribute.trait)
                  ?.options || []
              }
              onChange={(evt) => {
                updateFilters(attribute.trait, evt.target.value as string[])
              }}
              input={<OutlinedInput label={attribute.trait} />}
              renderValue={(selected) => (
                <ChipContainer>
                  {selected.map((value) => (
                    <ChipItem key={value}>
                      <Chip label={value} />
                    </ChipItem>
                  ))}
                </ChipContainer>
              )}
            >
              {attribute.options.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </ItemContainer>
      ))}
    </RootContainer>
  )
}

export default CollectionFilters
