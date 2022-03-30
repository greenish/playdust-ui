import styled from '@emotion/styled'
import FlagIcon from '@mui/icons-material/Flag'
import { Chip, IconButton, Tooltip } from '@mui/material'
import { useMemo } from 'react'
import {
  useRecoilValue,
  useRecoilValueLoadable,
  useSetRecoilState,
} from 'recoil'
import * as store from '../store'
import CollectionCard from './CollectionCard'

const RootContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const CardContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`

const ChipContainer = styled.div`
  display: flex;
  gap: 8px;
`

const ReportButton = styled(IconButton)`
  position: absolute;
  right: 16px;
`

const humanizeSolana = (input?: number) => {
  if (!input) {
    return '0'
  }

  const rounded = Math.round((input + Number.EPSILON) * 100) / 100

  return `${rounded.toLocaleString()} SOL`
}

const CollectionOverview = () => {
  const collectionId = useRecoilValue(store.collectionId)!
  const collection = useRecoilValueLoadable(store.collectionById(collectionId))
  const overview = useRecoilValueLoadable(
    store.collectionOverview(collectionId)
  )
  const initCollectionQuery = store.useInitializeCollectionQuery()
  const setOpen = useSetRecoilState(store.flaggedModal)
  const setId = useSetRecoilState(store.flaggedId)

  const { volume, floorPrice, listedItems, similar, elementCount } =
    useMemo(() => {
      if (overview.state === 'hasValue') {
        return overview.contents
      }

      return {
        volume: 0,
        floorPrice: 0,
        listedItems: '',
        similar: [],
        elementCount: 0,
      }
    }, [overview])

  const isPossibleDuplicate = useMemo(() => {
    if (!similar.length) {
      return false
    }

    const highestVolume = similar[0]?.volume || 0

    return highestVolume > volume
  }, [overview])

  return (
    <RootContainer>
      <Tooltip title="Report this collection">
        <ReportButton
          onClick={() => {
            setId(collectionId)
            setOpen(true)
          }}
        >
          <FlagIcon />
        </ReportButton>
      </Tooltip>
      <CardContainer>
        {collection.state === 'hasValue' && (
          <CollectionCard {...collection.contents} cardSize={170} />
        )}
      </CardContainer>
      <ChipContainer>
        <Chip
          label={`Total Volume: ${humanizeSolana(volume)}`}
          variant="outlined"
        />
        <Chip
          label={`Floor Price: ${humanizeSolana(floorPrice)}`}
          variant="outlined"
        />
        <Chip label={`Total Items: ${elementCount}`} variant="outlined" />
        <Chip label={`Listed Items: ${listedItems}`} variant="outlined" />
        {isPossibleDuplicate && (
          <Tooltip
            sx={{
              cursor: 'pointer',
            }}
            title="This collection has been detected as a possible duplicate of a larger collection, click to view orginal"
            onClick={() => initCollectionQuery(similar[0].id)}
          >
            <Chip
              label={`Possible Duplicate`}
              variant="outlined"
              color="warning"
            />
          </Tooltip>
        )}
      </ChipContainer>
    </RootContainer>
  )
}

export default CollectionOverview
