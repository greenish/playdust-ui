import { Grid } from '@mui/material'
import { ParsedAccountData, PublicKey } from '@solana/web3.js'
import { BigNumber } from 'bignumber.js'
import { useRecoilValue } from 'recoil'
import { solanaCluster } from '../../../../../store'
import { addressLabel } from '../../../helpers/tx'
import { useAccountInfo, useTokenRegistry } from '../../../store'
import { ExplorerCard } from '../../ExplorerCard'
import { AccountLink } from '../../Links'

interface TokenAccountProps {
  pubkey: PublicKey
}

const TokenAccountContent = ({ pubkey }: TokenAccountProps) => {
  const account = useAccountInfo(pubkey)
  const cluster = useRecoilValue(solanaCluster)
  const tokenRegistry = useTokenRegistry()
  const label = addressLabel(pubkey.toBase58(), cluster.network, tokenRegistry)

  const data = account?.data as ParsedAccountData

  const info = data?.parsed?.info

  console.log('info', info)

  let unit, balance
  if (info.isNative) {
    unit = 'SOL'
    balance = (
      <>
        ◎
        <span className="font-monospace">
          {new BigNumber(info.tokenAmount.uiAmountString).toFormat(9)}
        </span>
      </>
    )
  } else {
    balance = <>{info.tokenAmount.uiAmountString}</>
    unit = tokenRegistry.get(info.mint)?.symbol || 'tokens'
  }

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
        Mint
      </Grid>
      <Grid item xs={12} md={10}>
        <AccountLink to={info.mint} allowCopy />
      </Grid>
      <Grid item xs={12} md={2}>
        Owner
      </Grid>
      <Grid item xs={12} md={10}>
        <AccountLink to={info.owner} allowCopy />
      </Grid>
      <Grid item xs={12} md={2}>
        Token balance ({unit})
      </Grid>
      <Grid item xs={12} md={10}>
        {balance}
      </Grid>
      {info.state === 'uninitialized' && (
        <>
          <Grid item xs={12} md={2}>
            Status
          </Grid>
          <Grid item xs={12} md={10}>
            Uninitialized
          </Grid>
        </>
      )}
      {info.rentExemptReserve && (
        <>
          <Grid item xs={12} md={2}>
            Rent-exempt reserve (SOL)
          </Grid>
          <Grid item xs={12} md={10}>
            {new BigNumber(info.rentExemptReserve.uiAmountString).toFormat(9)}
          </Grid>
        </>
      )}
    </Grid>
  )
}

// DNiJ7fmPKDNNMXTAmiWKDTwgHdWW6KUuTZcEyP1Pmh4j
export const TokenAccount = (props: TokenAccountProps) => {
  return (
    <ExplorerCard skeleton="table" title="Token Account">
      <TokenAccountContent {...props} />
    </ExplorerCard>
  )
}
