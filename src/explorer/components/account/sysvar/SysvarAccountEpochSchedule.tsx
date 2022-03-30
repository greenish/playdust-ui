import { ParsedAccountData, PublicKey } from '@solana/web3.js'
import { useAccountInfo } from '../../../store'
import { AccountDetails } from '../../AccountDetails'
import { ExplorerCard } from '../../ExplorerCard'
import { ExplorerGrid } from '../../ExplorerGrid'
import { AccountLink, SlotLink } from '../../Links'
import { SolBalance } from '../../SolBalance'

interface SysvarAccountProps {
  pubkey: PublicKey
}

const SysvarAccountEpochScheduleContent = ({ pubkey }: SysvarAccountProps) => {
  const account = useAccountInfo(pubkey)

  if (!account) {
    return <div>No data available</div>
  }

  const parsed = (account.data as ParsedAccountData).parsed

  /*
        <Typography variant="h5" component="h2" gutterBottom>
          Sysvar: Epoch Schedule
        </Typography>
   */

  const rows = [
    ['Address', <AccountLink to={pubkey.toBase58()} allowCopy />],
    ['SOL Balance', <SolBalance lamports={account.lamports} />],
    ['Slots Per Epoch', parsed.info.slotsPerEpoch],
    ['Leader Schedule Slot Offset', parsed.info.leaderScheduleSlotOffset],
    [
      'Epoch Warmup Enabled',
      <code>{parsed.info.warmup ? 'true' : 'false'}</code>,
    ],
    ['First Normal Epoch', parsed.info.firstNormalEpoch],
    ['First Normal Slot', <SlotLink to={parsed.info.firstNormalSlot} />],
  ]

  return <ExplorerGrid rows={rows} />
}

// SysvarEpochSchedu1e111111111111111111111111
// History
export const SysvarAccountEpochSchedule = (props: SysvarAccountProps) => {
  return (
    <>
      <ExplorerCard skeleton="table" title="Sysvar: Epoch Schedule">
        <SysvarAccountEpochScheduleContent {...props} />
      </ExplorerCard>
      <AccountDetails pubkey={props.pubkey} />
    </>
  )
}
