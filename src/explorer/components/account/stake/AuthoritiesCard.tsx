import { PublicKey } from '@solana/web3.js'
import { compact } from '../../../../common/helpers/utils'
import { ExplorerCard, ExplorerGrid } from '../../common'
import { useStakeAccount } from './utils'

interface StakeAccountProps {
  pubkey: PublicKey
}

const AuthoritiesCardContent = ({ pubkey }: StakeAccountProps) => {
  const { stakeAccount } = useStakeAccount(pubkey)

  if (!stakeAccount) {
    return <div>No data available</div>
  }

  const meta = stakeAccount.meta

  const hasLockup = meta.lockup.unixTimestamp > 0

  const rows = compact([
    [
      'Stake Authority Address',
      '',
      {
        /*<AccountLink to={meta.authorized.staker.toBase58()} allowCopy />*/
      },
    ],
    [
      'Withdraw Authority Address',
      '',
      {
        /*<AccountLink to={meta.authorized.withdrawer.toBase58()} allowCopy />*/
      },
    ],
    hasLockup && [
      'Lockup Authority Address',
      '',
      {
        /*<AccountLink to={meta.lockup.custodian.toBase58()} allowCopy />*/
      },
    ],
  ])

  return <ExplorerGrid rows={rows} />
}

export const AuthoritiesCard = (props: StakeAccountProps) => {
  return (
    <ExplorerCard skeleton="table" title="Authorities">
      <AuthoritiesCardContent {...props} />
    </ExplorerCard>
  )
}
