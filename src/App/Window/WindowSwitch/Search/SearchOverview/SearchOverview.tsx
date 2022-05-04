import styled from '@emotion/styled'
import { Chip, Skeleton, Typography } from '@mui/material'
import { Suspense } from 'react'
import { useRecoilValue, useRecoilValueLoadable } from 'recoil'
import type SearchOverviewResponseType from '../../../../../_types/SearchOverviewResponseType'
import humanizeSolana from '../../../../_helpers/humanizeSolana'
import collectionIdAtom from '../_atoms/collectionId'
import searchOverviewAtom from '../_atoms/searchOverview'
import CollectionOverview from './CollectionOverview/CollectionOverview'

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
    getValue: ({ count }: SearchOverviewResponseType) => {
      return `${count.toLocaleString()}${count >= max ? '+' : ''}`
    },
  },
  {
    label: 'Listed Items',
    getValue: ({ listed }: SearchOverviewResponseType) => {
      return listed.toLocaleString()
    },
  },
  {
    label: 'Floor Price',
    getValue: ({ floor }: SearchOverviewResponseType) => {
      return humanizeSolana(floor)
    },
  },
  {
    label: 'Ceiling Price',
    getValue: ({ ceiling }: SearchOverviewResponseType) => {
      return humanizeSolana(ceiling)
    },
  },
]

const SearchOverview = () => {
  const { state, contents } = useRecoilValueLoadable(searchOverviewAtom)
  const collectionId = useRecoilValue(collectionIdAtom)

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
