import { Box, Grid, Typography } from '@mui/material'
import { ParsedAccountData, PublicKey } from '@solana/web3.js'
import { DateTime } from 'luxon'
import { useAccountInfo } from '../../../store'
import { ErrorCard } from '../ErrorCard'
import { ExplorerCard } from '../ExplorerCard'
import { AccountLink, EpochLink, SlotLink } from '../Links'
import { SolBalance } from '../SolBalance'

interface SysvarAccountProps {
  pubkey: PublicKey
}

// SysvarC1ock11111111111111111111111111111111
const SysvarAccountClock = ({ pubkey }: SysvarAccountProps) => {
  const account = useAccountInfo(pubkey)

  if (!account) {
    return <div>No data available</div>
  }

  const parsed = (account.data as ParsedAccountData).parsed

  const dt = DateTime.fromSeconds(parsed.info.unixTimestamp * 1000)
  const timestamp = dt.toLocaleString(DateTime.DATETIME_FULL)

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h5" component="h2" gutterBottom>
          Sysvar: Clock
        </Typography>
      </Grid>
      <Grid item xs={12} md={2}>
        Address
      </Grid>
      <Grid item xs={12} md={10}>
        <AccountLink to={pubkey.toBase58()} allowCopy />
      </Grid>
      <Grid item xs={12} md={2}>
        SOL Balance
      </Grid>
      <Grid item xs={12} md={10}>
        <SolBalance lamports={account.lamports} />
      </Grid>
      <Grid item xs={12} md={2}>
        Timestamp
      </Grid>
      <Grid item xs={12} md={10}>
        {timestamp}
      </Grid>
      <Grid item xs={12} md={2}>
        Epoch
      </Grid>
      <Grid item xs={12} md={10}>
        <EpochLink to={parsed.info.epoch} allowCopy />
      </Grid>
      <Grid item xs={12} md={2}>
        Leader Schedule Epoch
      </Grid>
      <Grid item xs={12} md={10}>
        <EpochLink to={parsed.info.leaderScheduleEpoch} allowCopy />
      </Grid>
      <Grid item xs={12} md={2}>
        Slot
      </Grid>
      <Grid item xs={12} md={10}>
        <SlotLink to={parsed.info.slot} allowCopy />
      </Grid>
    </Grid>
  )
}

// SysvarRent111111111111111111111111111111111
const SysvarAccountRent = ({ pubkey }: SysvarAccountProps) => {
  const account = useAccountInfo(pubkey)

  if (!account) {
    return <div>No data available</div>
  }

  const parsed = (account.data as ParsedAccountData).parsed

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h5" component="h2" gutterBottom>
          Sysvar: Rent
        </Typography>
      </Grid>
      <Grid item xs={12} md={2}>
        Address
      </Grid>
      <Grid item xs={12} md={10}>
        <AccountLink to={pubkey.toBase58()} allowCopy />
      </Grid>
      <Grid item xs={12} md={2}>
        SOL Balance
      </Grid>
      <Grid item xs={12} md={10}>
        <SolBalance lamports={account.lamports} />
      </Grid>
      <Grid item xs={12} md={2}>
        Burn Percent
      </Grid>
      <Grid item xs={12} md={10}>
        {parsed.info.burnPercent + '%'}
      </Grid>
      <Grid item xs={12} md={2}>
        Exemption Threshold
      </Grid>
      <Grid item xs={12} md={10}>
        {parsed.info.exemptionThreshold} years
      </Grid>
      <Grid item xs={12} md={2}>
        Lamports Per Byte Year
      </Grid>
      <Grid item xs={12} md={10}>
        {parsed.info.lamportsPerByteYear}
      </Grid>
    </Grid>
  )
}

// SysvarRewards111111111111111111111111111111
const SysvarAccountRewards = ({ pubkey }: SysvarAccountProps) => {
  const account = useAccountInfo(pubkey)

  if (!account) {
    return <div>No data available</div>
  }

  const parsed = (account.data as ParsedAccountData).parsed

  const validatorPointValueFormatted = new Intl.NumberFormat('en-US', {
    maximumSignificantDigits: 20,
  }).format(parsed.info.validatorPointValue)

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h5" component="h2" gutterBottom>
          Sysvar: Rewards
        </Typography>
      </Grid>

      <Grid item xs={12} md={2}>
        Address
      </Grid>
      <Grid item xs={12} md={10}>
        <AccountLink to={pubkey.toBase58()} allowCopy />
      </Grid>
      <Grid item xs={12} md={2}>
        SOL Balance
      </Grid>
      <Grid item xs={12} md={10}>
        <SolBalance lamports={account.lamports} />
      </Grid>
      <Grid item xs={12} md={2}>
        Validator Point Value
      </Grid>
      <Grid item xs={12} md={10}>
        {validatorPointValueFormatted} lamports
      </Grid>
    </Grid>
  )
}

// SysvarEpochSchedu1e111111111111111111111111
const SysvarAccountEpochSchedule = ({ pubkey }: SysvarAccountProps) => {
  const account = useAccountInfo(pubkey)

  if (!account) {
    return <div>No data available</div>
  }

  const parsed = (account.data as ParsedAccountData).parsed

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h5" component="h2" gutterBottom>
          Sysvar: Epoch Schedule
        </Typography>
      </Grid>
      <Grid item xs={12} md={2}>
        Address
      </Grid>
      <Grid item xs={12} md={10}>
        <AccountLink to={pubkey.toBase58()} allowCopy />
      </Grid>
      <Grid item xs={12} md={2}>
        SOL Balance
      </Grid>
      <Grid item xs={12} md={10}>
        <SolBalance lamports={account.lamports} />
      </Grid>
      <Grid item xs={12} md={2}>
        Slots Per Epoch
      </Grid>
      <Grid item xs={12} md={10}>
        {parsed.info.slotsPerEpoch}
      </Grid>
      <Grid item xs={12} md={2}>
        Leader Schedule Slot Offset
      </Grid>
      <Grid item xs={12} md={10}>
        {parsed.info.leaderScheduleSlotOffset}
      </Grid>
      <Grid item xs={12} md={2}>
        Epoch Warmup Enabled
      </Grid>
      <Grid item xs={12} md={10}>
        <code>{parsed.info.warmup ? 'true' : 'false'}</code>
      </Grid>
      <Grid item xs={12} md={2}>
        First Normal Epoch
      </Grid>
      <Grid item xs={12} md={10}>
        {parsed.info.firstNormalEpoch}
      </Grid>
      <Grid item xs={12} md={2}>
        First Normal Slot
      </Grid>
      <Grid item xs={12} md={10}>
        <SlotLink to={parsed.info.firstNormalSlot} />
      </Grid>
    </Grid>
  )
}

// SysvarFees111111111111111111111111111111111
const SysvarAccountFees = ({ pubkey }: SysvarAccountProps) => {
  const account = useAccountInfo(pubkey)

  if (!account) {
    return <div>No data available</div>
  }

  const parsed = (account.data as ParsedAccountData).parsed

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h5" component="h2" gutterBottom>
          Sysvar: Fees
        </Typography>
      </Grid>
      <Grid item xs={12} md={2}>
        Address
      </Grid>
      <Grid item xs={12} md={10}>
        <AccountLink to={pubkey.toBase58()} allowCopy />
      </Grid>
      <Grid item xs={12} md={2}>
        SOL Balance
      </Grid>
      <Grid item xs={12} md={10}>
        <SolBalance lamports={account.lamports} />
      </Grid>
      <Grid item xs={12} md={2}>
        Lamports Per Signature
      </Grid>
      <Grid item xs={12} md={10}>
        {parsed.info.feeCalculator.lamportsPerSignature}
      </Grid>
    </Grid>
  )
}

// SysvarRecentB1ockHashes11111111111111111111
const SysvarAccountRecentBlockhashes = ({ pubkey }: SysvarAccountProps) => {
  const account = useAccountInfo(pubkey)

  if (!account) {
    return <div>No data available</div>
  }

  const parsed = (account.data as ParsedAccountData).parsed

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h5" component="h2" gutterBottom>
          Sysvar: Recent Blockhashes
        </Typography>
      </Grid>
      <Grid item xs={12} md={2}>
        Address
      </Grid>
      <Grid item xs={12} md={10}>
        <AccountLink to={pubkey.toBase58()} allowCopy />
      </Grid>
      <Grid item xs={12} md={2}>
        SOL Balance
      </Grid>
      <Grid item xs={12} md={10}>
        <SolBalance lamports={account.lamports} />
      </Grid>
    </Grid>
  )
}

// /SysvarS1otHashes111111111111111111111111111
const SysvarAccountSlotHashes = ({ pubkey }: SysvarAccountProps) => {
  const account = useAccountInfo(pubkey)

  if (!account) {
    return <div>No data available</div>
  }

  const parsed = (account.data as ParsedAccountData).parsed

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h5" component="h2" gutterBottom>
          Sysvar: Clock
        </Typography>
      </Grid>
      <Grid item xs={12} md={2}>
        Address
      </Grid>
      <Grid item xs={12} md={10}>
        <AccountLink to={pubkey.toBase58()} allowCopy />
      </Grid>
      <Grid item xs={12} md={2}>
        SOL Balance
      </Grid>
      <Grid item xs={12} md={10}>
        <SolBalance lamports={account.lamports} />
      </Grid>
    </Grid>
  )
}

// SysvarS1otHistory11111111111111111111111111
const SysvarAccountSlotHistory = ({ pubkey }: SysvarAccountProps) => {
  const account = useAccountInfo(pubkey)

  if (!account) {
    return <div>No data available</div>
  }

  const parsed = (account.data as ParsedAccountData).parsed

  const history = Array.from(
    {
      length: 100,
    },
    (v, k) => parsed.info.nextSlot - k
  )

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h5" component="h2" gutterBottom>
          Sysvar: Slot History
        </Typography>
      </Grid>
      <Grid item xs={12} md={2}>
        Address
      </Grid>
      <Grid item xs={12} md={10}>
        <AccountLink to={pubkey.toBase58()} allowCopy />
      </Grid>
      <Grid item xs={12} md={2}>
        SOL Balance
      </Grid>
      <Grid item xs={12} md={10}>
        <SolBalance lamports={account.lamports} />
      </Grid>
      <Grid item xs={12} md={2}>
        Slot History (previous 100 slots)
      </Grid>
      <Grid item xs={12} md={10}>
        {history.map((val) => (
          <SlotLink key={val} to={val} allowCopy />
        ))}
      </Grid>
    </Grid>
  )
}

// SysvarStakeHistory1111111111111111111111111
const SysvarAccountStakeHistory = ({ pubkey }: SysvarAccountProps) => {
  const account = useAccountInfo(pubkey)

  if (!account) {
    return <div>No data available</div>
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h5" component="h2" gutterBottom>
          Sysvar: Stake History
        </Typography>
      </Grid>
      <Grid item xs={12} md={2}>
        Address
      </Grid>
      <Grid item xs={12} md={10}>
        <AccountLink to={pubkey.toBase58()} allowCopy />
      </Grid>
      <Grid item xs={12} md={2}>
        SOL Balance
      </Grid>
      <Grid item xs={12} md={10}>
        <SolBalance lamports={account.lamports} />
      </Grid>
    </Grid>
  )
}

const map: Record<string, any> = {
  clock: SysvarAccountClock,
  rent: SysvarAccountRent,
  rewards: SysvarAccountRewards,
  epochSchedule: SysvarAccountEpochSchedule,
  fees: SysvarAccountFees,
  recentBlockhashes: SysvarAccountRecentBlockhashes,
  slotHashes: SysvarAccountSlotHashes,
  slotHistory: SysvarAccountSlotHistory,
  stakeHistory: SysvarAccountStakeHistory,
}

export const SysvarAccountContent = ({ pubkey }: SysvarAccountProps) => {
  const account = useAccountInfo(pubkey)

  if (!account) {
    return <div>No data available</div>
  }

  const parsed = (account.data as ParsedAccountData).parsed

  const Section = map[parsed.type] || ErrorCard

  return <Section pubkey={pubkey} />
}

export const SysvarAccount = (props: SysvarAccountProps) => {
  return (
    <ExplorerCard skeleton="table">
      <Box
        sx={{
          bgcolor: 'background.paper',
        }}
      >
        <SysvarAccountContent {...props} />
      </Box>
    </ExplorerCard>
  )
}
