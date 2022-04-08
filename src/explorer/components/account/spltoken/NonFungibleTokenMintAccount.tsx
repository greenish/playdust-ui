import { Grid, Stack, Typography } from '@mui/material'
import { PublicKey } from '@solana/web3.js'
import { useEffect, useState } from 'react'
import { getNFTCensorStatus } from '../../../../common/helpers/playdustApi'
import { Status } from '../../../../common/types/Status'
import { useNFTDetails } from '../../../store'
import {
  Attributes,
  Creators,
  Details,
  Image,
  Overview,
  Tools,
  Trading,
} from './nft'

type TokenOverviewProps = {
  pubkey: PublicKey
}

export const NonFungibleTokenMintAccount = (props: TokenOverviewProps) => {
  const { pubkey } = props

  const [status, setStatus] = useState(Status.None)

  const details = useNFTDetails(pubkey)

  useEffect(() => {
    ;(async () => {
      try {
        const { type } = await getNFTCensorStatus(pubkey.toBase58())
        setStatus(type)
      } catch (err) {
        setStatus(Status.None)
      }
    })()
  }, [pubkey])

  if (!details) {
    return <Typography>Unable to fetch {pubkey}</Typography>
  }

  return (
    <Grid container spacing={0}>
      <Grid item xs={6}>
        <Image details={details} mint={pubkey.toBase58()} status={status} />
      </Grid>
      <Grid item xs={6}>
        <Typography variant="h4" component="h1">
          {details.data.name}
        </Typography>
        <Tools pubkey={pubkey} />
        <Stack spacing={2}>
          <Trading pubkey={pubkey} status={status} />
          <Creators details={details} />
          <Attributes details={details} />
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Stack spacing={2}>
          <Overview {...props} />
          <Details pubkey={pubkey} />
        </Stack>
      </Grid>
    </Grid>
  )
}
