import { PublicKey } from '@solana/web3.js'
import { useAccountInfo } from '../../../store'
import { ExplorerCard } from '../ExplorerCard'

interface TokenAccountProps {
  pubkey: PublicKey
}

export const TokenAccountContent = ({ pubkey }: TokenAccountProps) => {
  const account = useAccountInfo(pubkey)

  if (!account) {
    return <div>No data available</div>
  }

  return <div>Token Placeholder</div>
}

export const TokenAccount = (props: TokenAccountProps) => {
  return (
    <ExplorerCard skeleton="table" title="Overview">
      <TokenAccountContent {...props} />
    </ExplorerCard>
  )
}
