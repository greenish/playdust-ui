import { ParsedAccountData, PublicKey } from '@solana/web3.js'
import { useAccountInfo } from '../../../store'
import { ExplorerCard } from '../../ExplorerCard'
import { ExplorerGrid } from '../../ExplorerGrid'
import { AccountLink, SlotLink } from '../../Links'
import { SolBalance } from '../../SolBalance'

interface SysvarAccountProps {
  pubkey: PublicKey
}

// SysvarS1otHistory11111111111111111111111111
// History
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

export const SysvarAccountSlotHistory = (props: SysvarAccountProps) => {
  return (
    <ExplorerCard skeleton="table" title="Sysvar: Slot History">
      <SysvarAccountSlotHistoryContent {...props} />
    </ExplorerCard>
  )
}
