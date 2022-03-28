import { Box } from '@mui/material'
import { ParsedAccountData, PublicKey } from '@solana/web3.js'
import { FunctionComponent } from 'react'
import { useAccountInfo } from '../../store'
import { ErrorCard } from '../ErrorCard'
import { ExplorerCard } from '../ExplorerCard'
import {
  SysvarAccountClock,
  SysvarAccountEpochSchedule,
  SysvarAccountFees,
  SysvarAccountRecentBlockhashes,
  SysvarAccountRent,
  SysvarAccountRewards,
  SysvarAccountSlotHashes,
  SysvarAccountSlotHistory,
  SysvarAccountStakeHistory,
} from './sysvar'

interface SysvarAccountProps {
  pubkey: PublicKey
}

const map: Record<string, FunctionComponent<SysvarAccountProps>> = {
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
