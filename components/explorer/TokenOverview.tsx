import { Box, Grid, Typography } from '@mui/material'
import { useAccountDetails } from '../../store'
import { NFTOverview } from './NFTOverview'

const IDENTICON_WIDTH = 64

type TokenOverviewProps = {
  pubkey: any
}

export const TokenOverview = ({ pubkey }: TokenOverviewProps) => {
  let details = useAccountDetails(pubkey)

  const { nftData, isMetaplexNFT, tokenDetails } = details

  const {
    metadata: {
      data: { name, symbol },
    },
    json,
  } = nftData

  const icon = tokenDetails?.logoURI ? (
    <img
      src={tokenDetails.logoURI}
      alt="token logo"
      className="avatar-img rounded-circle border border-4 border-body"
      style={{ width: IDENTICON_WIDTH }}
    />
  ) : null

  return (
    <>
      {isMetaplexNFT && nftData ? (
        <>
          <Box
            sx={{
              bgcolor: 'background.paper',
            }}
          >
            <img src={json?.image} width={150} />
            <Typography variant="h5" component="h2" gutterBottom>
              {name}
            </Typography>
            <Typography variant="h6" component="h3" gutterBottom>
              {symbol}
            </Typography>
          </Box>
          <NFTOverview details={details} />
        </>
      ) : (
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
      )}
    </>
  )
}
