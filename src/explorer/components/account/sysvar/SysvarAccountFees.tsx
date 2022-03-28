import { ParsedAccountData, PublicKey } from '@solana/web3.js'
import { useAccountInfo } from '../../../store'
import { ExplorerCard } from '../../ExplorerCard'
import { ExplorerGrid } from '../../ExplorerGrid'
import { AccountLink } from '../../Links'
import { SolBalance } from '../../SolBalance'

interface SysvarAccountProps {
  pubkey: PublicKey
}

// SysvarFees111111111111111111111111111111111
// History
const SysvarAccountFeesContent = ({ pubkey }: SysvarAccountProps) => {
  const account = useAccountInfo(pubkey)

  if (!account) {
    return <div>No data available</div>
  }

  const parsed = (account.data as ParsedAccountData).parsed

  const rows = [
    ['Address', <AccountLink to={pubkey.toBase58()} allowCopy />],
    ['SOL Balance', <SolBalance lamports={account.lamports} />],
    ['Lamports Per Signature', parsed.info.feeCalculator.lamportsPerSignature],
  ]

  return <ExplorerGrid rows={rows} />
}

export const SysvarAccountFees = (props: SysvarAccountProps) => {
  return (
    <ExplorerCard skeleton="table" title="Sysvar: Fees">
      <SysvarAccountFeesContent {...props} />
    </ExplorerCard>
  )
}
