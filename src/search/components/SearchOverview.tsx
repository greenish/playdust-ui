import styled from '@emotion/styled'
import { Chip, Skeleton, Typography } from '@mui/material'
import { Suspense } from 'react'
import { useRecoilValue, useRecoilValueLoadable } from 'recoil'
import { humanizeSolana } from '../../common/helpers/utils'
import * as store from '../store'
import { SearchOverviewResponse } from '../types/SearchResponse'
import CollectionOverview from './CollectionOverview'

const RootContainer = styled.div`
  height: 48px;
  display: flex;
  align-items: center;
  overflow-x: scroll;
`

const ChipContentContainer = styled.div`
  display: flex;
`

const max = 10000

const chips = [
  {
    label: 'Total Items',
    getValue: ({ count }: SearchOverviewResponse) => {
      return `${count.toLocaleString()}${count >= max ? '+' : ''}`
    },
  },
  {
    label: 'Listed Items',
    getValue: ({ listed }: SearchOverviewResponse) => {
      return listed.toLocaleString()
    },
  },
  {
    label: 'Floor Price',
    getValue: ({ floor }: SearchOverviewResponse) => {
      return humanizeSolana(floor)
    },
  },
  {
    label: 'Ceiling Price',
    getValue: ({ ceiling }: SearchOverviewResponse) => {
      return humanizeSolana(ceiling)
    },
  },
]

const SearchOverview = () => {
  const { state, contents } = useRecoilValueLoadable(store.searchOverview)
  const collectionId = useRecoilValue(store.collectionId)

  return (
    <RootContainer>
      {chips.map((chip) => (
        <Chip
          key={chip.label}
          size="small"
          sx={{ mr: 1 }}
          label={
            <ChipContentContainer>
              {chip.label}:{' '}
              {state === 'hasValue' ? (
                chip.getValue(contents)
              ) : (
                <Skeleton variant="text" width={35} />
              )}
            </ChipContentContainer>
          }
          variant="outlined"
        />
      ))}
      {collectionId && (
        <Suspense fallback={<></>}>
          <Typography sx={{ mr: 1 }}>&middot;</Typography>
          <CollectionOverview />
        </Suspense>
      )}
    </RootContainer>
  )
}

export default SearchOverview
