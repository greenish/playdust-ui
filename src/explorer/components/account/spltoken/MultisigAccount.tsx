import { Grid } from '@mui/material'
import { ParsedAccountData, PublicKey } from '@solana/web3.js'
import { useAccountInfo } from '../../../store'
import { ExplorerCard } from '../../ExplorerCard'
import { AccountLink } from '../../Links'

interface TokenAccountProps {
  pubkey: PublicKey
}

const MultisigAccountContent = ({ pubkey }: TokenAccountProps) => {
  const account = useAccountInfo(pubkey)
  const data = account?.data as ParsedAccountData

  console.log('account', account)

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={2}>
        Address
      </Grid>
      <Grid item xs={12} md={10}>
        <AccountLink to={pubkey.toBase58()} allowCopy />
      </Grid>
      <Grid item xs={12} md={2}>
        Required Signers
      </Grid>
      <Grid item xs={12} md={10}>
        {data?.parsed?.info?.numRequiredSigners}
      </Grid>
      <Grid item xs={12} md={2}>
        Valid Signers
      </Grid>
      <Grid item xs={12} md={10}>
        {data?.parsed?.info?.numValidSigners}
      </Grid>
      {(data?.parsed?.info?.signers || []).map((signer: string) => (
        <>
          <Grid item xs={12} md={2}>
            Signer
          </Grid>
          <Grid item xs={12} md={10}>
            <AccountLink to={signer} allowCopy />
          </Grid>
        </>
      ))}
    </Grid>
  )
}

// Q6XprfkF8RQQKoQVG33xT88H7wi8Uk1B1CC7YAs69Gi
export const MultisigAccount = (props: TokenAccountProps) => {
  return (
    <ExplorerCard skeleton="table" title="Multisig Account">
      <MultisigAccountContent {...props} />
    </ExplorerCard>
  )
}
