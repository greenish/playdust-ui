import { ParsedAccountData, PublicKey } from '@solana/web3.js'
import { DateTime } from 'luxon'
import { useAccountInfo } from '../../../store'
import { ExplorerCard } from '../../ExplorerCard'
import { ExplorerGrid } from '../../ExplorerGrid'
import { AccountLink, EpochLink, SlotLink } from '../../Links'
import { SolBalance } from '../../SolBalance'

interface SysvarAccountProps {
  pubkey: PublicKey
}

// SysvarC1ock11111111111111111111111111111111
// History
export const SysvarAccountClockContent = ({ pubkey }: SysvarAccountProps) => {
  const account = useAccountInfo(pubkey)

  if (!account) {
    return <div>No data available</div>
  }

  const parsed = (account.data as ParsedAccountData).parsed

  const dt = DateTime.fromSeconds(parsed.info.unixTimestamp * 1000)
  const timestamp = dt.toLocaleString(DateTime.DATETIME_FULL)

  const rows = [
    ['Address', <AccountLink to={pubkey.toBase58()} allowCopy />],
    ['SOL Balance', <SolBalance lamports={account.lamports} />],
    ['Timestamp', timestamp],
    ['Epoch', <EpochLink to={parsed.info.epoch} allowCopy />],
    [
      'Leader Schedule Epoch',
      <EpochLink to={parsed.info.leaderScheduleEpoch} allowCopy />,
    ],
    ['Slot', <SlotLink to={parsed.info.slot} allowCopy />],
  ]

  return <ExplorerGrid rows={rows} />
}

export const SysvarAccountClock = (props: SysvarAccountProps) => {
  return (
    <ExplorerCard skeleton="table" title="Sysvar: Clock">
      <SysvarAccountClockContent {...props} />
    </ExplorerCard>
  )
}
