import { PublicKey } from '@solana/web3.js'
import { useAccountInfo } from '../../../store'
import { ExplorerCard } from '../ExplorerCard'

interface VoteAccountProps {
  pubkey: PublicKey
}

export const VoteAccountContent = ({ pubkey }: VoteAccountProps) => {
  const account = useAccountInfo(pubkey)

  if (!account) {
    return <div>No data available</div>
  }

  return <div>Vote Placeholder</div>
}

export const VoteAccount = (props: VoteAccountProps) => {
  return (
    <ExplorerCard skeleton="table" title="Overview">
      <VoteAccountContent {...props} />
    </ExplorerCard>
  )
}
