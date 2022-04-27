import { ParsedAccountData, PublicKey } from '@solana/web3.js'
import { useAccountInfo } from '../../../store'
import {
  AccountLink,
  ExplorerCard,
  ExplorerGrid,
  SlotLink,
  SolBalance,
} from '../../common'
import { AccountDetails } from '../AccountDetails'

interface SysvarAccountProps {
  pubkey: PublicKey
}

const SysvarAccountSlotHistoryContent = ({ pubkey }: SysvarAccountProps) => {
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

  const rows = [
    ['Address', <AccountLink to={pubkey.toBase58()} allowCopy />],
    ['SOL Balance', <SolBalance lamports={account.lamports} />],
    [
      'Slot History (previous 100 slots)',
      <>
        {history.map((val) => (
          <>
            <SlotLink key={val} to={val} allowCopy />
            <br />
          </>
        ))}
      </>,
    ],
  ]

  return <ExplorerGrid rows={rows} />
}

// SysvarS1otHistory11111111111111111111111111
// History
export const SysvarAccountSlotHistory = (props: SysvarAccountProps) => {
  return (
    <>
      <ExplorerCard skeleton="table" title="Sysvar: Slot History">
        <SysvarAccountSlotHistoryContent {...props} />
      </ExplorerCard>
      <AccountDetails pubkey={props.pubkey} />
    </>
  )
}
