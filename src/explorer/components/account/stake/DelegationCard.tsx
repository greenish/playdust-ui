import { PublicKey } from '@solana/web3.js'
import BN from 'bn.js'
import compact from '../../../helpers/compact'
import { EpochLink, ExplorerCard, ExplorerGrid, SolBalance } from '../../common'
import { displayStatus, MAX_EPOCH, useStakeAccount } from './utils'

interface StakeAccountProps {
  pubkey: PublicKey
}

const DelegationCardContent = ({ pubkey }: StakeAccountProps) => {
  const { stakeAccount, stakeAccountType, activation, hideDelegation } =
    useStakeAccount(pubkey)

  if (!stakeAccount) {
    return <div>No data available</div>
  }

  if (hideDelegation) {
    return null
  }

  let voterPubkey
  let activationEpoch
  let deactivationEpoch

  const delegation = stakeAccount?.stake?.delegation

  const delegationActivationEpoch = new BN(delegation.activationEpoch, 10)
  const delegationDeactivationEpoch = new BN(delegation.deactivationEpoch, 10)

  if (delegation) {
    voterPubkey = delegation.voter
    if (!delegationActivationEpoch.eq(MAX_EPOCH)) {
      activationEpoch = delegationActivationEpoch.toNumber()
    }
    if (!delegationDeactivationEpoch.eq(MAX_EPOCH)) {
      deactivationEpoch = delegationDeactivationEpoch.toNumber()
    }
  }
  const { stake } = stakeAccount

  const rows = compact([
    ['Status', displayStatus(stakeAccountType, activation)],
    stake && [
      'Delegated Stake (SOL)',
      <SolBalance lamports={new BN(stake.delegation.stake, 10)} />,
    ],
    activation && [
      'Active Stake (SOL)',
      <SolBalance lamports={activation.active} />,
    ],
    activation && [
      'Inactive Stake (SOL)',
      <SolBalance lamports={activation.inactive} />,
    ],
    voterPubkey && [
      'Delegated Vote Address',
      '' /*<AccountLink to={voterPubkey.toBase58()} allowCopy />*/,
    ],
    [
      'Activation Epoch',
      activationEpoch !== undefined ? <EpochLink to={activationEpoch} /> : '-',
    ],
    [
      'Deactivation Epoch',
      deactivationEpoch !== undefined ? (
        <EpochLink to={deactivationEpoch} />
      ) : (
        '-'
      ),
    ],
  ])

  return <ExplorerGrid rows={rows} />
}

export const DelegationCard = (props: StakeAccountProps) => {
  return (
    <ExplorerCard skeleton="table" title="Stake Delegation">
      <DelegationCardContent {...props} />
    </ExplorerCard>
  )
}
