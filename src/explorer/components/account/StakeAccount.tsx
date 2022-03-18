import { Grid } from '@mui/material'
import {
  AccountInfo,
  ParsedAccountData,
  PublicKey,
  StakeActivationData,
} from '@solana/web3.js'
import BN from 'bn.js'
import { DateTime } from 'luxon'
import { useAccountInfo, useStakeActivation } from '../../store'
import { ExplorerCard } from '../ExplorerCard'
import { AccountLink, EpochLink } from '../Links'
import { SolBalance } from '../SolBalance'

interface StakeMeta {
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

interface StakeAccountInfo {
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

type StakeAccountType =
  | 'uninitialized'
  | 'initialized'
  | 'delegated'
  | 'rewardsPool'

const MAX_EPOCH = new BN(2).pow(new BN(64)).sub(new BN(1))

const useStakeAccount = (
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

const LockupCardContent = ({ pubkey }: StakeAccountProps) => {
  const { stakeAccount } = useStakeAccount(pubkey)

  if (!stakeAccount) {
    return <div>No data available</div>
  }

  const unixTimestamp = 1000 * (stakeAccount.meta?.lockup.unixTimestamp || 0)

  if (Date.now() < unixTimestamp) {
    const prettyTimestamp = (() => {
      const dt = DateTime.fromSeconds(unixTimestamp)
      return dt.toLocaleString(DateTime.DATETIME_FULL)
    })()
    return (
      <div>
        <strong>Account is locked!</strong> Lockup expires on {prettyTimestamp}
      </div>
    )
  }

  return null
}

const LockupCard = (props: StakeAccountProps) => {
  return (
    <ExplorerCard skeleton="table">
      <LockupCardContent {...props} />
    </ExplorerCard>
  )
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

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={2}>
        Address
      </Grid>
      <Grid item xs={12} md={10}>
        <AccountLink to={pubkey.toBase58()} allowCopy />
      </Grid>
      <Grid item xs={12} md={2}>
        Balance (SOL)
      </Grid>
      <Grid item xs={12} md={10}>
        <SolBalance lamports={account.lamports || 0} />
      </Grid>
      <Grid item xs={12} md={2}>
        Rent Reserve (SOL)
      </Grid>
      <Grid item xs={12} md={10}>
        <SolBalance
          lamports={new BN(stakeAccount.meta.rentExemptReserve, 10)}
        />
      </Grid>
      {hideDelegation && (
        <>
          <Grid item xs={12} md={2}>
            Status
          </Grid>
          <Grid item xs={12} md={10}>
            {isFullyInactivated(stakeAccount, activation)
              ? 'Not delegated'
              : displayStatus(stakeAccountType, activation)}
          </Grid>
        </>
      )}
    </Grid>
  )
}

const OverviewCard = (props: StakeAccountProps) => {
  return (
    <ExplorerCard skeleton="table" title="Stake Account">
      <OverviewCardContent {...props} />
    </ExplorerCard>
  )
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
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={2}>
        Status
      </Grid>
      <Grid item xs={12} md={10}>
        {displayStatus(stakeAccountType, activation)}
      </Grid>
      {stake && (
        <>
          <Grid item xs={12} md={2}>
            Delegated Stake (SOL)
          </Grid>
          <Grid item xs={12} md={10}>
            <SolBalance lamports={new BN(stake.delegation.stake, 10)} />
          </Grid>

          {activation && (
            <>
              <Grid item xs={12} md={2}>
                Active Stake (SOL)
              </Grid>
              <Grid item xs={12} md={10}>
                <SolBalance lamports={activation.active} />
              </Grid>
              <Grid item xs={12} md={2}>
                Inactive Stake (SOL)
              </Grid>
              <Grid item xs={12} md={10}>
                <SolBalance lamports={activation.inactive} />
              </Grid>
            </>
          )}

          {voterPubkey && (
            <>
              <Grid item xs={12} md={2}>
                Delegated Vote Address
              </Grid>
              <Grid item xs={12} md={10}>
                <AccountLink to={voterPubkey.toBase58()} allowCopy />
              </Grid>
            </>
          )}

          <Grid item xs={12} md={2}>
            Activation Epoch
          </Grid>
          <Grid item xs={12} md={10}>
            {activationEpoch !== undefined ? (
              <EpochLink to={activationEpoch} />
            ) : (
              '-'
            )}
          </Grid>
          <Grid item xs={12} md={2}>
            Deactivation Epoch
          </Grid>
          <Grid item xs={12} md={10}>
            {deactivationEpoch !== undefined ? (
              <EpochLink to={deactivationEpoch} />
            ) : (
              '-'
            )}
          </Grid>
        </>
      )}
    </Grid>
  )
}

const DelegationCard = (props: StakeAccountProps) => {
  return (
    <ExplorerCard skeleton="table" title="Stake Delegation">
      <DelegationCardContent {...props} />
    </ExplorerCard>
  )
}

const AuthoritiesCardContent = ({ pubkey }: StakeAccountProps) => {
  const { stakeAccount } = useStakeAccount(pubkey)

  if (!stakeAccount) {
    return <div>No data available</div>
  }

  const meta = stakeAccount.meta

  const hasLockup = meta.lockup.unixTimestamp > 0

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={2}>
        Stake Authority Address
      </Grid>
      <Grid item xs={12} md={10}>
        <AccountLink to={meta.authorized.staker.toBase58()} allowCopy />
      </Grid>
      <Grid item xs={12} md={2}>
        Withdraw Authority Address
      </Grid>
      <Grid item xs={12} md={10}>
        <AccountLink to={meta.authorized.withdrawer.toBase58()} allowCopy />
      </Grid>

      {hasLockup && (
        <>
          <Grid item xs={12} md={2}>
            Lockup Authority Address
          </Grid>
          <Grid item xs={12} md={10}>
            <AccountLink to={meta.lockup.custodian.toBase58()} allowCopy />
          </Grid>
        </>
      )}
    </Grid>
  )
}

const AuthoritiesCard = (props: StakeAccountProps) => {
  return (
    <ExplorerCard skeleton="table" title="Authorities">
      <AuthoritiesCardContent {...props} />
    </ExplorerCard>
  )
}

interface StakeAccountProps {
  pubkey: PublicKey
}

// Stake11111111111111111111111111111111111111
// AD8QGGAk1fJUYsyGPidF1Xu4TS4koc4BLirc1YE8uMxQ
export const StakeAccount = ({ pubkey }: StakeAccountProps) => {
  return (
    <>
      <LockupCard pubkey={pubkey} />
      <OverviewCard pubkey={pubkey} />
      <DelegationCard pubkey={pubkey} />
      <AuthoritiesCard pubkey={pubkey} />
    </>
  )
}

const TYPE_NAMES: Record<string, string> = {
  uninitialized: 'Uninitialized',
  initialized: 'Initialized',
  delegated: 'Delegated',
  rewardsPool: 'RewardsPool',
}

function displayStatus(
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

function isFullyInactivated(
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
