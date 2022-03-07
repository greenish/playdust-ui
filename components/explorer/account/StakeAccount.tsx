import { PublicKey } from '@solana/web3.js'
import { useAccountInfo } from '../../../store'
import { ExplorerCard } from '../ExplorerCard'

interface StakeAccountProps {
  pubkey: PublicKey
}

export const StakeAccountContent = ({ pubkey }: StakeAccountProps) => {
  const account = useAccountInfo(pubkey)

  if (!account) {
    return <div>No data available</div>
  }

  return <div>Stake Placeholder</div>
}

export const StakeAccount = (props: StakeAccountProps) => {
  return (
    <ExplorerCard skeleton="table" title="Overview">
      <StakeAccountContent {...props} />
    </ExplorerCard>
  )
}
