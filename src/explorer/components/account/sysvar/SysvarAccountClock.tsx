import { ParsedAccountData, PublicKey } from '@solana/web3.js'
import { toLocaleString } from '../../../../common/helpers/utils'
import { useAccountInfo } from '../../../store'
import {
  AccountLink,
  EpochLink,
  ExplorerCard,
  ExplorerGrid,
  SlotLink,
  SolBalance,
} from '../../common'
import { AccountDetails } from '../AccountDetails'
interface SysvarAccountProps {
  pubkey: PublicKey
}

export const SysvarAccountClockContent = ({ pubkey }: SysvarAccountProps) => {
  const account = useAccountInfo(pubkey)

  if (!account) {
    return <div>No data available</div>
  }

  const parsed = (account.data as ParsedAccountData).parsed

  const timestamp = toLocaleString(parsed.info.unixTimestamp)

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

// SysvarC1ock11111111111111111111111111111111
// History
export const SysvarAccountClock = (props: SysvarAccountProps) => {
  return (
    <>
      <ExplorerCard skeleton="table" title="Sysvar: Clock">
        <SysvarAccountClockContent {...props} />
      </ExplorerCard>
      <AccountDetails pubkey={props.pubkey} />
    </>
  )
}
