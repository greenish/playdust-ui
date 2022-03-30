import { Box, Typography } from '@mui/material'
import { compact, toLocaleString } from '../../../helpers/utils'
import { useEpoch } from '../store'
import { ExplorerGrid } from './ExplorerGrid'
import { EpochLink, SlotLink } from './Links'

interface EpochOverviewProps {
  epoch: number
}

export const EpochOverview = ({ epoch }: EpochOverviewProps) => {
  const epochDetails = useEpoch(epoch)

  if (!epoch || !epochDetails) {
    return <div>Epoch ${epoch} not found</div>
  }

  const {
    currentEpoch,
    firstSlot,
    lastSlot,
    firstBlock,
    lastBlock,
    firstTimestamp,
    lastTimestamp,
  } = epochDetails

  const rows = compact([
    ['Epoch', <EpochLink to={epoch} allowCopy />],
    epoch > 0 && ['Previous Epoch', <EpochLink to={epoch - 1} allowCopy />],
    [
      'Next Epoch',
      currentEpoch > epoch ? (
        <EpochLink to={epoch + 1} allowCopy />
      ) : (
        <span>Epoch in progress</span>
      ),
    ],
    ['First Slot', <SlotLink to={firstSlot} allowCopy />],
    ['Last Slot', <SlotLink to={lastSlot} allowCopy />],
    firstTimestamp && ['First Block Timestamp', toLocaleString(firstTimestamp)],
    ['First Block', <SlotLink to={firstBlock} allowCopy />],
    [
      'Last Block',
      lastBlock !== undefined ? (
        <SlotLink to={lastBlock} />
      ) : (
        <span>Epoch in progress</span>
      ),
    ],
    lastTimestamp && ['Last Block Timestamp', toLocaleString(lastTimestamp)],
  ])

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
      }}
      p={4}
    >
      <Typography variant="h5" component="h2" gutterBottom>
        Overview
      </Typography>
      <ExplorerGrid rows={rows} />
    </Box>
  )
}
