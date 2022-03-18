import { Grid } from '@mui/material'
import { ParsedAccountData, PublicKey } from '@solana/web3.js'
import { DateTime } from 'luxon'
import { useAccountInfo } from '../../store'
import { ExplorerCard } from '../ExplorerCard'
import { AccountLink, SlotLink } from '../Links'
import { SolBalance } from '../SolBalance'

interface VoteAccountProps {
  pubkey: PublicKey
}

export const VoteAccountContent = ({ pubkey }: VoteAccountProps) => {
  const account = useAccountInfo(pubkey)

  if (!account) {
    return <div>No data available</div>
  }

  const voteAccount = (account.data as ParsedAccountData).parsed

  const dt = DateTime.fromSeconds(
    voteAccount.info.lastTimestamp.timestamp * 1000
  )
  const lastTimestamp = dt.toLocaleString(DateTime.DATETIME_FULL)

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={2}>
        SOL Balance
      </Grid>
      <Grid item xs={12} md={10}>
        <SolBalance lamports={account.lamports} />
      </Grid>
      <Grid item xs={12} md={2}>
        Authorized Voter
        {voteAccount.info.authorizedVoters.length > 1 ? 's' : ''}
      </Grid>
      <Grid item xs={12} md={10}>
        {voteAccount.info.authorizedVoters.map((voter: any) => {
          return (
            <AccountLink
              key={voter.authorizedVoter.toString()}
              to={voter.authorizedVoter}
              allowCopy
            />
          )
        })}
      </Grid>
      <Grid item xs={12} md={2}>
        Authorized Withdrawer
      </Grid>
      <Grid item xs={12} md={10}>
        <AccountLink to={voteAccount.info.authorizedWithdrawer} allowCopy />
      </Grid>
      <Grid item xs={12} md={2}>
        Last Timestamp
      </Grid>
      <Grid item xs={12} md={10}>
        {lastTimestamp}
      </Grid>
      <Grid item xs={12} md={2}>
        Commission
      </Grid>
      <Grid item xs={12} md={10}>
        {voteAccount.info.commission + '%'}
      </Grid>
      <Grid item xs={12} md={2}>
        Root Slot
      </Grid>
      <Grid item xs={12} md={10}>
        {voteAccount.info.rootSlot !== null ? (
          <SlotLink to={voteAccount.info.rootSlot} allowCopy />
        ) : (
          'N/A'
        )}
      </Grid>
    </Grid>
  )
}

// Fx9gdBmp4Rer7rxu139ofGKcx3iffKS91gg2kFUeBvjD
export const VoteAccount = (props: VoteAccountProps) => {
  return (
    <ExplorerCard skeleton="table" title="Vote Overview">
      <VoteAccountContent {...props} />
    </ExplorerCard>
  )
}
