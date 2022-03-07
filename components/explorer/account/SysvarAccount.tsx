import { PublicKey } from '@solana/web3.js'
import { useAccountInfo } from '../../../store'
import { ExplorerCard } from '../ExplorerCard'

interface SysvarAccountProps {
  pubkey: PublicKey
}

export const SysvarAccountContent = ({ pubkey }: SysvarAccountProps) => {
  const account = useAccountInfo(pubkey)

  if (!account) {
    return <div>No data available</div>
  }

  return <div>Sysvar Placeholder</div>
}

export const SysvarAccount = (props: SysvarAccountProps) => {
  return (
    <ExplorerCard skeleton="table" title="Overview">
      <SysvarAccountContent {...props} />
    </ExplorerCard>
  )
}
