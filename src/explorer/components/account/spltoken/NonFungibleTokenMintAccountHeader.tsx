import {
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { useRouter } from 'next/router'
import React, { Suspense } from 'react'
import TradeNFT from '../../../../nft/components/TradeNFT'
import { useNFTDetails } from '../../../store'
import { ExternalLink } from '../../ExternalLinks'

interface NonFungibleTokenMintAccountHeaderProps {
  pubkey: PublicKey
}

export const NonFungibleTokenMintAccountHeader = ({
  pubkey,
}: NonFungibleTokenMintAccountHeaderProps) => {
  const router = useRouter()
  const { publicKey: walletPublicKey } = useWallet()
  const details = useNFTDetails(pubkey)

  if (!details) {
    return <Typography>Unable to fetch {pubkey}</Typography>
  }

  const handleChangeCreator = (event: SelectChangeEvent) => {
    debugger
    router.push(`/account/${event.target.value}`)
  }

  return (
    <Grid container spacing={0}>
      <Grid item xs={2}>
        <img
          alt={details.data.name || ''}
          src={details.offChainData.image}
          width={150}
        />
        <ExternalLink url={details.offChainData.image} label="VIEW ORIGINAL" />
      </Grid>
      <Grid item xs={10}>
        <Typography variant="h4" component="h1">
          {details.data.name}
        </Typography>
        {walletPublicKey && (
          <Suspense fallback={<CircularProgress />}>
            <TradeNFT mint={pubkey.toBase58()} publicKey={walletPublicKey} />
          </Suspense>
        )}
        <Grid container spacing={0}>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel id="creators-label">Creators</InputLabel>
              <Select
                labelId="creators-label"
                value=""
                label="Creators"
                onChange={handleChangeCreator}
              >
                {details.data.creators?.map((e) => (
                  <MenuItem key={e.address} value={e.address}>
                    {e.address}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel id="attributes-label">Attributes</InputLabel>
              <Select labelId="attributes-label" label="Attributes" value="">
                {details.offChainData.attributes?.map((e) => (
                  <MenuItem key={e.trait_type} value={e.trait_type}>
                    {e.value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}
