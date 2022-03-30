import { PublicKey } from '@solana/web3.js'
import { toLocaleString } from '../../../../../helpers/utils'
import { ExplorerCard } from '../../ExplorerCard'
import { useStakeAccount } from './utils'

interface StakeAccountProps {
  pubkey: PublicKey
}

const LockupCardContent = ({ pubkey }: StakeAccountProps) => {
  const { stakeAccount } = useStakeAccount(pubkey)

  if (!stakeAccount) {
    return <div>No data available</div>
  }

  const unixTimestamp = 1000 * (stakeAccount.meta?.lockup.unixTimestamp || 0)

  if (Date.now() < unixTimestamp) {
    const prettyTimestamp = toLocaleString(
      stakeAccount.meta?.lockup.unixTimestamp || 0
    )
    return (
      <div>
        <strong>Account is locked!</strong> Lockup expires on {prettyTimestamp}
      </div>
    )
  }

  return null
}

export const LockupCard = (props: StakeAccountProps) => {
  return (
    <ExplorerCard skeleton="table">
      <LockupCardContent {...props} />
    </ExplorerCard>
  )
}
