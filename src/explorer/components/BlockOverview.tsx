import { Box, Typography } from '@mui/material'
import { lamportsToSol, toLocaleString } from '../../../helpers/utils'
import { useBlock, useSOLPrice } from '../store'
import { ExplorerGrid } from './ExplorerGrid'
import { SlotLink } from './Links'

interface BlockOverviewProps {
  slot: number
}

export const BlockOverview = ({ slot }: BlockOverviewProps) => {
  const block = useBlock(slot)
  const solPrice = useSOLPrice()

  if (!block) {
    return <div>Block ${slot} not found</div>
  }

  const {
    blockTime,
    blockhash,
    parentSlot,
    previousBlockhash,
    rewards,
    transactions,
  } = block

  let leader = ''

  const rewardTotal = (rewards || []).reduce((accum: number, reward: any) => {
    if (reward.rewardType === 'Fee') {
      leader = reward.pubkey
    }
    return accum + reward.lamports
  }, 0)

  const rewardTotalInSOL = lamportsToSol(rewardTotal)
  const valueOfSOL = rewardTotalInSOL * solPrice
  const reward = `${rewardTotalInSOL} SOL (\$${valueOfSOL}) SOL price ${solPrice}`

  const localBlockTime = toLocaleString(blockTime)

  const rows = [
    [
      'Block',
      <>
        #{parentSlot + 1} <SlotLink to={parentSlot} label="Prev" />{' '}
        <SlotLink to={parentSlot + 2} label="Next" />
      </>,
    ],
    ['Timestamp (Local)', localBlockTime],
    ['Block Hash', blockhash],
    ['Leader', leader],
    ['Reward', reward],
    ['Transactions Total', `${transactions.length} transactions (successful?)`],
    ['Previous Block Hash', previousBlockhash],
  ]

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
