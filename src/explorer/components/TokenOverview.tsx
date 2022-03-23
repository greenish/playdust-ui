import { Box, Grid, Typography } from '@mui/material'
import { PublicKey } from '@solana/web3.js'
import { useRouter } from 'next/router'
import { useAccountDetails } from '../store'

const IDENTICON_WIDTH = 64

type TokenOverviewProps = {
  pubkey: PublicKey
}

export const TokenOverview = ({ pubkey }: TokenOverviewProps) => {
  const router = useRouter()
  const details = useAccountDetails(pubkey)

  const { nftData, isMetaplexNFT, tokenDetails } = details

  if (isMetaplexNFT && nftData) {
    router.push(`/nfts/${pubkey.toBase58()}`)
    return null
  }

  const icon = tokenDetails?.logoURI ? (
    <img
      src={tokenDetails.logoURI}
      alt="token logo"
      className="avatar-img rounded-circle border border-4 border-body"
      style={{ width: IDENTICON_WIDTH }}
    />
  ) : null

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs="auto">
          {icon}
        </Grid>
        <Grid item>
          <Typography variant="h5" component="h2" gutterBottom>
            Token
          </Typography>
          <Typography variant="h6" component="h2" gutterBottom>
            {tokenDetails?.name || 'Unknown Token'}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  )
}
