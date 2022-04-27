import { PublicKey } from '@solana/web3.js'
import { useAccountInfo } from '../../../store'
import {
  AccountLink,
  ExplorerCard,
  ExplorerGrid,
  SolBalance,
} from '../../common'
import { AccountDetails } from '../AccountDetails'

interface SysvarAccountProps {
  pubkey: PublicKey
}

// SysvarS1otHashes111111111111111111111111111
// History | Slot Hashses
const SysvarAccountSlotHashesContent = ({ pubkey }: SysvarAccountProps) => {
  const account = useAccountInfo(pubkey)

  if (!account) {
    return <div>No data available</div>
  }

  const rows = [
    ['Address', <AccountLink to={pubkey.toBase58()} allowCopy />],
    ['SOL Balance', <SolBalance lamports={account.lamports} />],
  ]

  return <ExplorerGrid rows={rows} />
}

export const SysvarAccountSlotHashes = (props: SysvarAccountProps) => {
  return (
    <>
      <ExplorerCard skeleton="table" title="Sysvar: Slot Hashes">
        <SysvarAccountSlotHashesContent {...props} />
      </ExplorerCard>
      <AccountDetails pubkey={props.pubkey} />
    </>
  )
}
