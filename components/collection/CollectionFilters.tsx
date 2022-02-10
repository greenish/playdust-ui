import styled from '@emotion/styled'
import {
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from '@mui/material'
import { useEffect, useState } from 'react'
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
  const identifier = useRecoilValue(store.collectionIdentifier)
  const symbol = identifier?.symbol as string
  const { attributes } = useRecoilValue(
    store.fetchCollectionAggregation(symbol)
  )
  const filters = useRecoilValue(store.collectionFilters)
  const resetFilters = useResetRecoilState(store.collectionFilters)
  const updateFilters = store.useUpdateCollectionFilters()
  const [openIdx, setOpenIdx] = useState(-1)

  useEffect(() => resetFilters, [])

  return (
    <RootContainer>
      {attributes.map((attribute, idx) => (
        <ItemContainer key={attribute.trait}>
          <FormControl fullWidth>
            <InputLabel>{attribute.trait}</InputLabel>
            <Select
              open={idx === openIdx}
              multiple
              value={
                filters.find((entry) => entry.trait === attribute.trait)
                  ?.options || []
              }
              onOpen={() => setOpenIdx(idx)}
              onClose={() => setOpenIdx(-1)}
              onChange={(evt) => {
                updateFilters(attribute.trait, evt.target.value as string[])
                setOpenIdx(-1)
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
