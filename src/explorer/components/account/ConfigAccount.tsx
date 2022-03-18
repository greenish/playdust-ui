import { Grid } from '@mui/material'
import { ParsedAccountData, PublicKey } from '@solana/web3.js'
import { FunctionComponent } from 'react'
import { useAccountInfo } from '../../store'
import { ErrorCard } from '../ErrorCard'
import { ExplorerCard } from '../ExplorerCard'
import { AccountLink } from '../Links'
import { SolBalance } from '../SolBalance'

const MAX_SLASH_PENALTY = Math.pow(2, 8)

interface ConfigAccountProps {
  pubkey: PublicKey
}

const StakeConfigContent = ({ pubkey }: ConfigAccountProps) => {
  const account = useAccountInfo(pubkey)

  if (!account) {
    return <div>No data available</div>
  }

  const { lamports } = account

  const configAccount = (account.data as ParsedAccountData).parsed

  const warmupCooldownFormatted = new Intl.NumberFormat('en-US', {
    style: 'percent',
    maximumFractionDigits: 2,
  }).format(configAccount.info.warmupCooldownRate)

  const slashPenaltyFormatted = new Intl.NumberFormat('en-US', {
    style: 'percent',
    maximumFractionDigits: 2,
  }).format(configAccount.info.slashPenalty / MAX_SLASH_PENALTY)

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={2}>
        Address
      </Grid>
      <Grid item xs={12} md={10}>
        <AccountLink to={pubkey.toBase58()} allowCopy />
      </Grid>
      <Grid item xs={12} md={2}>
        SOL Balance
      </Grid>
      <Grid item xs={12} md={10}>
        <SolBalance lamports={lamports} />
      </Grid>
      <Grid item xs={12} md={2}>
        Warmup / Cooldown Rate
      </Grid>
      <Grid item xs={12} md={10}>
        {warmupCooldownFormatted}
      </Grid>
      <Grid item xs={12} md={2}>
        Slash Penalty
      </Grid>
      <Grid item xs={12} md={10}>
        {slashPenaltyFormatted}
      </Grid>
    </Grid>
  )
}

const StakeConfig = (props: ConfigAccountProps) => {
  return (
    <ExplorerCard skeleton="table" title="Stake Config">
      <StakeConfigContent {...props} />
    </ExplorerCard>
  )
}

const ValidatorInfoContent = ({ pubkey }: ConfigAccountProps) => {
  const account = useAccountInfo(pubkey)

  if (!account) {
    return <div>No data available</div>
  }

  const { lamports } = account

  const configAccount = (account.data as ParsedAccountData).parsed

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={2}>
        Address
      </Grid>
      <Grid item xs={12} md={10}>
        <AccountLink to={pubkey.toBase58()} allowCopy />
      </Grid>
      <Grid item xs={12} md={2}>
        SOL Balance
      </Grid>
      <Grid item xs={12} md={10}>
        <SolBalance lamports={lamports} />
      </Grid>

      {configAccount.info.configData.name && (
        <>
          <Grid item xs={12} md={2}>
            Name
          </Grid>
          <Grid item xs={12} md={10}>
            {configAccount.info.configData.name}
          </Grid>
        </>
      )}

      {configAccount.info.configData.keybaseUsername && (
        <>
          <Grid item xs={12} md={2}>
            Keybase Username
          </Grid>
          <Grid item xs={12} md={10}>
            {configAccount.info.configData.keybaseUsername}
          </Grid>
        </>
      )}

      {configAccount.info.configData.website && (
        <>
          <Grid item xs={12} md={2}>
            Website
          </Grid>
          <Grid item xs={12} md={10}>
            <a
              href={configAccount.info.configData.website}
              target="_blank"
              rel="noopener noreferrer"
            >
              {configAccount.info.configData.website}
            </a>
          </Grid>
        </>
      )}

      {configAccount.info.configData.details && (
        <>
          <Grid item xs={12} md={2}>
            Details
          </Grid>
          <Grid item xs={12} md={10}>
            {configAccount.info.configData.details}
          </Grid>
        </>
      )}

      {configAccount.info.keys && configAccount.info.keys.length > 1 && (
        <>
          <Grid item xs={12} md={2}>
            Signer
          </Grid>
          <Grid item xs={12} md={10}>
            <AccountLink to={configAccount.info.keys[1].pubkey} allowCopy />
          </Grid>
        </>
      )}
    </Grid>
  )
}

const ValidatorInfo = (props: ConfigAccountProps) => {
  return (
    <ExplorerCard skeleton="table" title="Validator Info">
      <ValidatorInfoContent {...props} />
    </ExplorerCard>
  )
}

const map: Record<string, FunctionComponent<ConfigAccountProps>> = {
  stakeConfig: StakeConfig,
  validatorInfo: ValidatorInfo,
}

// Config1111111111111111111111111111111111111
export const ConfigAccount = ({ pubkey }: ConfigAccountProps) => {
  const account = useAccountInfo(pubkey)

  if (!account) {
    return <ErrorCard />
  }

  const Section =
    map[(account.data as ParsedAccountData).parsed.type] || ErrorCard

  return <Section pubkey={pubkey} />
}
