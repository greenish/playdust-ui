import { Grid } from '@mui/material'
import { PublicKey } from '@solana/web3.js'
import { useRecoilValue } from 'recoil'
import { solanaCluster } from '../../../../store'
import { getSpace } from '../../helpers/account'
import { addressLabel, displayAddress } from '../../helpers/tx'
import { useAccountInfo, useTokenRegistry } from '../../store'
import { ExplorerCard } from '../ExplorerCard'
import { AccountLink } from '../Links'
import { SolBalance } from '../SolBalance'

interface UnknownAccountProps {
  pubkey: PublicKey
}

// To test this component use:
// NativeLoader1111111111111111111111111111111 (no account, just pubkey)
export const UnknownAccountContent = ({ pubkey }: UnknownAccountProps) => {
  const account = useAccountInfo(pubkey)
  const tokenRegistry = useTokenRegistry()
  const cluster = useRecoilValue(solanaCluster)

  // Even if there is no matching account, we still display the pubkey

  const details = account || {
    executable: false,
    owner: undefined,
    lamports: undefined,
    data: undefined,
  }

  const label = addressLabel(pubkey.toBase58(), cluster.network, tokenRegistry)

  const assignedProgramId = (() => {
    if (!details.owner) {
      return null
    }

    try {
      const owner = details.owner.toBase58()

      const addressToDisplay = displayAddress(
        owner,
        cluster.network,
        tokenRegistry
      )
      return <AccountLink to={owner} label={addressToDisplay} />
    } catch (err) {
      return JSON.stringify(details.owner)
    }
  })()

  const space = getSpace(account)

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={2}>
        Address
      </Grid>
      <Grid item xs={12} md={10}>
        <AccountLink to={pubkey.toBase58()} allowCopy />
      </Grid>
      {label && (
        <>
          <Grid item xs={12} md={2}>
            Address Label
          </Grid>
          <Grid item xs={12} md={10}>
            {label}
          </Grid>
        </>
      )}
      <Grid item xs={12} md={2}>
        Balance (SOL)
      </Grid>
      <Grid item xs={12} md={10}>
        <SolBalance lamports={details?.lamports || 0} />
      </Grid>
      {space !== undefined && (
        <>
          <Grid item xs={12} md={2}>
            Allocated Data Size
          </Grid>
          <Grid item xs={12} md={10}>
            {space} byte(s)
          </Grid>
        </>
      )}
      {assignedProgramId && (
        <>
          <Grid item xs={12} md={2}>
            Assigned Program Id
          </Grid>
          <Grid item xs={12} md={10}>
            {assignedProgramId}
          </Grid>
        </>
      )}
      {details && (
        <>
          <Grid item xs={12} md={2}>
            Executable
          </Grid>
          <Grid item xs={12} md={10}>
            {details.executable ? 'Yes' : 'No'}
          </Grid>
        </>
      )}
    </Grid>
  )
}

export const UnknownAccount = (props: UnknownAccountProps) => {
  return (
    <ExplorerCard skeleton="table" title="Overview">
      <UnknownAccountContent {...props} />
    </ExplorerCard>
  )
}
