import {
  Box,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { ExternalLink } from './ExternalLinks'

interface NFTOverviewProps {
  details: any
}

export const NFTOverview = ({ details }: NFTOverviewProps) => {
  if (!details.nftData) {
    return null
  }

  const {
    metadata: {
      updateAuthority,
      mint,
      data: { sellerFeeBasisPoints, creators },
    },
    json,
  } = details.nftData

  const { name: _name, symbol: _symbol, external_url } = json

  return (
    <Stack spacing={2}>
      <Box
        sx={{
          bgcolor: 'background.paper',
        }}
        p={4}
      >
        <Typography variant="h5" component="h2" gutterBottom>
          Token Overview
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={2}>
            Address
          </Grid>
          <Grid item xs={12} md={10}>
            {mint}
          </Grid>
          <Grid item xs={12} md={2}>
            Max Total Supply
          </Grid>
          <Grid item xs={12} md={10}>
            1
          </Grid>
          <Grid item xs={12} md={2}>
            Current Supply
          </Grid>
          <Grid item xs={12} md={10}>
            1
          </Grid>
          <Grid item xs={12} md={2}>
            Mint Authority
          </Grid>
          <Grid item xs={12} md={10}>
            28hyR9BnpjMRh32cjAMfatwSyhpKREPHbC4xuVEKfzbF
          </Grid>
          <Grid item xs={12} md={2}>
            Update Authority
          </Grid>
          <Grid item xs={12} md={10}>
            {updateAuthority}
          </Grid>
          <Grid item xs={12} md={2}>
            Website
          </Grid>
          <Grid item xs={12} md={10}>
            <ExternalLink url={external_url} label={external_url} />
          </Grid>
          <Grid item xs={12} md={2}>
            Seller Fee
          </Grid>
          <Grid item xs={12} md={10}>
            {sellerFeeBasisPoints / 100}%
          </Grid>
        </Grid>
      </Box>
      <Box
        sx={{
          bgcolor: 'background.paper',
        }}
        p={4}
      >
        <Typography variant="h5" component="h2" gutterBottom>
          Creators
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Creator Address</TableCell>
                <TableCell>Royalty</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {creators.map((creator: any, idx: number) => {
                const { address, verified, share } = creator

                return (
                  <TableRow
                    key={idx}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {verified} {address}
                    </TableCell>
                    <TableCell>{share}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Stack>
  )
}
