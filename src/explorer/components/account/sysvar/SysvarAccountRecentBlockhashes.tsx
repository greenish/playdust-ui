import { PublicKey } from '@solana/web3.js'
import { useAccountInfo } from '../../../store'
import { ExplorerCard } from '../../ExplorerCard'
import { ExplorerGrid } from '../../ExplorerGrid'
import { AccountLink } from '../../Links'
import { SolBalance } from '../../SolBalance'

interface SysvarAccountProps {
  pubkey: PublicKey
}

// SysvarRecentB1ockHashes11111111111111111111
// History | Blockhashes
export const SysvarAccountRecentBlockhashesContent = ({
  pubkey,
}: SysvarAccountProps) => {
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

export const SysvarAccountRecentBlockhashes = (props: SysvarAccountProps) => {
  return (
    <ExplorerCard skeleton="table" title="Sysvar: Recent Blockhashes">
      <SysvarAccountRecentBlockhashesContent {...props} />
    </ExplorerCard>
  )
}
