import { PublicKey } from '@solana/web3.js'
import { ExplorerCard } from '../ExplorerCard'
import { TokenOverview } from '../TokenOverview'

interface TokenAccountProps {
  pubkey: PublicKey
}

export const TokenAccountContent = ({ pubkey }: TokenAccountProps) => {
  return <TokenOverview pubkey={pubkey} />
}

export const TokenAccount = (props: TokenAccountProps) => {
  return (
    <ExplorerCard skeleton="table" title="Overview">
      <TokenAccountContent {...props} />
    </ExplorerCard>
  )
}
