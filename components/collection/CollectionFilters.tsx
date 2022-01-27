import {
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from '@mui/material'
import * as store from '../../store'
import { useRecoilValue } from 'recoil'
import styled from '@emotion/styled'

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
  const updateFilters = store.useUpdateCollectionFilters()

  return (
    <RootContainer>
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
