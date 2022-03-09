import { Grid } from '@mui/material'
import { ParsedAccountData, PublicKey } from '@solana/web3.js'
import { useAccountInfo } from '../../../store'
import { ExplorerCard } from '../ExplorerCard'
import { AccountLink } from '../Links'
import { SolBalance } from '../SolBalance'

interface NonceAccountProps {
  pubkey: PublicKey
}

export const NonceAccountContent = ({ pubkey }: NonceAccountProps) => {
  const account = useAccountInfo(pubkey)

  if (!account) {
    return <div>No data available</div>
  }

  const parsed = (account.data as ParsedAccountData).parsed

  const { lamports } = account

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
        Authority
      </Grid>
      <Grid item xs={12} md={10}>
        <AccountLink to={parsed.info.authority} allowCopy />
      </Grid>
      <Grid item xs={12} md={2}>
        Blockhash
      </Grid>
      <Grid item xs={12} md={10}>
        <code>{parsed.info.blockhash}</code>
      </Grid>
      <Grid item xs={12} md={2}>
        Fee
      </Grid>
      <Grid item xs={12} md={10}>
        {parsed.info.feeCalculator.lamportsPerSignature} lamports per signature
      </Grid>
    </Grid>
  )
}

export const NonceAccount = (props: NonceAccountProps) => {
  return (
    <ExplorerCard skeleton="table" title="Nonce Overview">
      <NonceAccountContent {...props} />
    </ExplorerCard>
  )
}
