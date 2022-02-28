import { Box, Grid, Typography } from '@mui/material'
import { DateTime } from 'luxon'
import { lamportsToSol } from '../../helpers/utils'
import { useBlock, useSOLPrice } from '../../store'
import { SlotLink as BlockLink } from './Links'

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

  let leader

  const rewardTotal = (rewards || []).reduce((accum: number, reward: any) => {
    if (reward.rewardType === 'Fee') {
      leader = reward.pubkey
    }
    return accum + reward.lamports
  }, 0)

  const rewardTotalInSOL = lamportsToSol(rewardTotal)
  const valueOfSOL = rewardTotalInSOL * solPrice
  const reward = `${rewardTotalInSOL} SOL (\$${valueOfSOL}) SOL price ${solPrice}`

  const localBlockTime = (() => {
    if (!blockTime) {
      return ''
    }
    const dt = DateTime.fromSeconds(blockTime)
    return dt.toLocaleString(DateTime.DATETIME_FULL)
  })()

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
      <Grid container spacing={2}>
        <Grid item xs={12} md={2}>
          Block
        </Grid>
        <Grid item xs={12} md={10}>
          #{parentSlot + 1} <BlockLink to={parentSlot} label="Prev" />{' '}
          <BlockLink to={parentSlot + 2} label="Next" />
        </Grid>
        <Grid item xs={12} md={2}>
          Timestamp (Local)
        </Grid>
        <Grid item xs={12} md={10}>
          {localBlockTime}
        </Grid>
        <Grid item xs={12} md={2}>
          Block Hash
        </Grid>
        <Grid item xs={12} md={10}>
          {blockhash}
        </Grid>
        <Grid item xs={12} md={2}>
          Leader
        </Grid>
        <Grid item xs={12} md={10}>
          {leader}
        </Grid>
        <Grid item xs={12} md={2}>
          Reward
        </Grid>
        <Grid item xs={12} md={10}>
          {reward}
        </Grid>
        <Grid item xs={12} md={2}>
          Transactions Total
        </Grid>
        <Grid item xs={12} md={10}>
          {transactions.length} transactions (successful?)
        </Grid>
        <Grid item xs={12} md={2}>
          Previous Block Hash
        </Grid>
        <Grid item xs={12} md={10}>
          {previousBlockhash}
        </Grid>
      </Grid>
    </Box>
  )
}
