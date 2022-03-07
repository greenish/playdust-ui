import { PublicKey } from '@solana/web3.js'
import { useAccountInfo } from '../../../store'
import { ExplorerCard } from '../ExplorerCard'

interface NonceAccountProps {
  pubkey: PublicKey
}

export const NonceAccountContent = ({ pubkey }: NonceAccountProps) => {
  const account = useAccountInfo(pubkey)

  if (!account) {
    return <div>No data available</div>
  }

  return <div>Nonce Placeholder</div>
}

export const NonceAccount = (props: NonceAccountProps) => {
  return (
    <ExplorerCard skeleton="table" title="Overview">
      <NonceAccountContent {...props} />
    </ExplorerCard>
  )
}
