import { PublicKey } from '@solana/web3.js'
import BN from 'bn.js'
import { compact } from '../../../../common/helpers/utils'
import {
  AccountLink,
  ExplorerCard,
  ExplorerGrid,
  SolBalance,
} from '../../common'
import { displayStatus, isFullyInactivated, useStakeAccount } from './utils'

interface StakeAccountProps {
  pubkey: PublicKey
}

const OverviewCardContent = ({ pubkey }: StakeAccountProps) => {
  const {
    account,
    stakeAccount,
    stakeAccountType,
    activation,
    hideDelegation,
  } = useStakeAccount(pubkey)

  if (!account || !stakeAccount) {
    return <div>No data available</div>
  }

  const rows = compact([
    ['Address', <AccountLink to={pubkey.toBase58()} allowCopy />],
    ['Balance (SOL)', <SolBalance lamports={account.lamports || 0} />],
    [
      'Rent Reserve (SOL)',
      <SolBalance lamports={new BN(stakeAccount.meta.rentExemptReserve, 10)} />,
    ],
    hideDelegation && [
      'Status',
      isFullyInactivated(stakeAccount, activation)
        ? 'Not delegated'
        : displayStatus(stakeAccountType, activation),
    ],
  ])

  return <ExplorerGrid rows={rows} />
}

export const OverviewCard = (props: StakeAccountProps) => {
  return (
    <ExplorerCard skeleton="table" title="Stake Account">
      <OverviewCardContent {...props} />
    </ExplorerCard>
  )
}
