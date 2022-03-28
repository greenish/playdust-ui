import { ParsedAccountData, PublicKey } from '@solana/web3.js'
import { useAccountInfo } from '../../../store'
import { ExplorerCard } from '../../ExplorerCard'
import { ExplorerGrid } from '../../ExplorerGrid'
import { AccountLink } from '../../Links'
import { SolBalance } from '../../SolBalance'

interface SysvarAccountProps {
  pubkey: PublicKey
}

// SysvarRewards111111111111111111111111111111
// History
const SysvarAccountRewardsContent = ({ pubkey }: SysvarAccountProps) => {
  const account = useAccountInfo(pubkey)

  if (!account) {
    return <div>No data available</div>
  }

  const parsed = (account.data as ParsedAccountData).parsed

  const validatorPointValueFormatted = new Intl.NumberFormat('en-US', {
    maximumSignificantDigits: 20,
  }).format(parsed.info.validatorPointValue)

  const rows = [
    ['Address', <AccountLink to={pubkey.toBase58()} allowCopy />],
    ['SOL Balance', <SolBalance lamports={account.lamports} />],
    ['Validator Point Value', <>{validatorPointValueFormatted} lamports</>],
  ]

  return <ExplorerGrid rows={rows} />
}

export const SysvarAccountRewards = (props: SysvarAccountProps) => {
  return (
    <ExplorerCard skeleton="table" title="Sysvar: Rewards">
      <SysvarAccountRewardsContent {...props} />
    </ExplorerCard>
  )
}
