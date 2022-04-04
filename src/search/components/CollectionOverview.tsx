import styled from '@emotion/styled'
import FlagIcon from '@mui/icons-material/Flag'
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Tooltip,
} from '@mui/material'
import { useWallet } from '@solana/wallet-adapter-react'
import { useMemo, useState } from 'react'
import { useCookies } from 'react-cookie'
import { useRecoilState, useRecoilValue, useRecoilValueLoadable } from 'recoil'
import { getRecoil } from 'recoil-nexus'
import { setCollectionCensorStatus } from '../../../helpers/auctionHouseApi'
import { userProfile } from '../../../store'
import Status from '../../../types/Status'
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

const StatusButton = styled(Button)`
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
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useRecoilState(store.collectionStatus)
  const [censorState, setCensorState] = useState(Status.None)
  const [cookies] = useCookies(['authToken'])
  const collectionId = useRecoilValue(store.collectionId)!
  const collection = useRecoilValueLoadable(store.collectionById(collectionId))
  const overview = useRecoilValueLoadable(
    store.collectionOverview(collectionId)
  )
  const { roles } = getRecoil(userProfile)
  const { publicKey } = useWallet()
  const initCollectionQuery = store.useInitializeCollectionQuery()
  const openFlaggedModal = store.useOpenFlaggedModal()

  const saveStatus = () => {
    setCollectionCensorStatus(collectionId, publicKey!.toBase58(), status)
    setStatus(censorState)
    setOpen(false)
  }

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
      {cookies.authToken ? (
        <>
          {roles.length && roles.includes('admin') ? (
            <>
              <StatusButton
                onClick={() => setOpen(true)}
                color="primary"
                variant="outlined"
              >
                Change status
              </StatusButton>
              <Dialog onClose={() => setOpen(false)} open={open}>
                <DialogTitle>Change item status</DialogTitle>
                <DialogContent>
                  <RadioGroup
                    value={censorState}
                    onChange={(e) => setCensorState(Number(e.target.value))}
                  >
                    <FormControlLabel
                      value={Status.None}
                      control={<Radio />}
                      label="None"
                    />
                    <FormControlLabel
                      value={Status.Censored}
                      control={<Radio />}
                      label="Censor"
                    />
                    <FormControlLabel
                      value={Status.NSFW}
                      control={<Radio />}
                      label="NFSW"
                    />
                  </RadioGroup>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpen(false)}>Cancel</Button>
                  <Button onClick={saveStatus}>Save</Button>
                </DialogActions>
              </Dialog>
            </>
          ) : (
            <Tooltip title="Report this collection">
              <ReportButton
                onClick={() => openFlaggedModal(collectionId, 'Collection')}
              >
                <FlagIcon />
              </ReportButton>
            </Tooltip>
          )}
        </>
      ) : null}
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
