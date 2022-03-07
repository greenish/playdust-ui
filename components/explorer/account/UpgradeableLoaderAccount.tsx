import { PublicKey } from '@solana/web3.js'
import { useAccountInfo } from '../../../store'
import { ExplorerCard } from '../ExplorerCard'

interface UpgradeableLoaderAccountProps {
  pubkey: PublicKey
}

export const UpgradeableLoaderAccountContent = ({
  pubkey,
}: UpgradeableLoaderAccountProps) => {
  const account = useAccountInfo(pubkey)

  if (!account) {
    return <div>No data available</div>
  }

  return <div>Upgradeable Loader Placeholder</div>
}

export const UpgradeableLoaderAccount = (
  props: UpgradeableLoaderAccountProps
) => {
  return (
    <ExplorerCard skeleton="table" title="Overview">
      <UpgradeableLoaderAccountContent {...props} />
    </ExplorerCard>
  )
}
