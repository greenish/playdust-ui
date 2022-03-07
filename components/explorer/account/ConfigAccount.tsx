import { PublicKey } from '@solana/web3.js'
import { useAccountInfo } from '../../../store'
import { ExplorerCard } from '../ExplorerCard'

interface ConfigAccountProps {
  pubkey: PublicKey
}

export const ConfigAccountContent = ({ pubkey }: ConfigAccountProps) => {
  const account = useAccountInfo(pubkey)

  if (!account) {
    return <div>No data available</div>
  }

  return <div>Config Placeholder</div>
}

export const ConfigAccount = (props: ConfigAccountProps) => {
  return (
    <ExplorerCard skeleton="table" title="Overview">
      <ConfigAccountContent {...props} />
    </ExplorerCard>
  )
}
