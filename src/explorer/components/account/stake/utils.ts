import {
  AccountInfo,
  ParsedAccountData,
  PublicKey,
  StakeActivationData,
} from '@solana/web3.js'
import BN from 'bn.js'
import { useAccountInfo, useStakeActivation } from '../../../store'

export const MAX_EPOCH = new BN(2).pow(new BN(64)).sub(new BN(1))

export interface StakeMeta {
  rentExemptReserve: BN
  authorized: {
    staker: PublicKey
    withdrawer: PublicKey
  }
  lockup: {
    unixTimestamp: number
    epoch: number
    custodian: PublicKey
  }
}

export interface StakeAccountInfo {
  meta: StakeMeta
  stake: {
    delegation: {
      voter: PublicKey
      stake: BN
      activationEpoch: BN
      deactivationEpoch: BN
      warmupCooldownRate: number
    }
    creditsObserved: number
  }
}

export type StakeAccountType =
  | 'uninitialized'
  | 'initialized'
  | 'delegated'
  | 'rewardsPool'

export const useStakeAccount = (
  pubkey: PublicKey
): {
  account?: AccountInfo<Buffer | ParsedAccountData>
  stakeAccount?: StakeAccountInfo
  stakeAccountType?: StakeAccountType
  activation?: StakeActivationData
  hideDelegation?: boolean
} => {
  const account = useAccountInfo(pubkey)
  const stakeActivation = useStakeActivation(pubkey)

  if (!account) {
    return {}
  }

  const parsed = (account.data as ParsedAccountData).parsed

  const stakeAccount = parsed.info
  const stakeAccountType = parsed.type

  const isDelegated = parsed.type === 'delegated'

  const activation = isDelegated ? stakeActivation : undefined

  const hideDelegation =
    !isDelegated || isFullyInactivated(parsed.info, activation)

  return {
    account,
    stakeAccount,
    stakeAccountType,
    activation,
    hideDelegation,
  }
}

const TYPE_NAMES: Record<string, string> = {
  uninitialized: 'Uninitialized',
  initialized: 'Initialized',
  delegated: 'Delegated',
  rewardsPool: 'RewardsPool',
}

export function displayStatus(
  stakeAccountType: StakeAccountType | undefined,
  activation?: StakeActivationData
) {
  if (!stakeAccountType) {
    return 'Unknown'
  }
  let status = TYPE_NAMES[stakeAccountType]
  let activationState = ''
  if (stakeAccountType !== 'delegated') {
    status = 'Not delegated'
  } else {
    activationState = activation ? `(${activation.state})` : ''
  }

  return [status, activationState].join(' ')
}

export function isFullyInactivated(
  stakeAccount: StakeAccountInfo,
  activation?: StakeActivationData
): boolean {
  const { stake } = stakeAccount

  if (!stake || !activation) {
    return false
  }

  const delegatedStake = new BN(stake.delegation.stake, 10).toNumber()
  const inactiveStake = activation.inactive

  return (
    !new BN(stake.delegation.deactivationEpoch, 10).eq(MAX_EPOCH) &&
    delegatedStake === inactiveStake
  )
}
