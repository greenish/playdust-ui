import styled from '@emotion/styled'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import FactCheckIcon from '@mui/icons-material/FactCheck'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material'
import { useWallet } from '@solana/wallet-adapter-react'
import { Suspense } from 'react'
import { useRecoilValue } from 'recoil'
import { shortenPublicKey } from '../../helpers/utils'
import { fetchNFTDetails } from '../../store'
import TradeNFT from './TradeNFT'

const ImageTradeContainer = styled.div`
  display: flex;
`

interface DetailsProps {
  mint: string
}

const Details = ({ mint }: DetailsProps) => {
  const details = useRecoilValue(fetchNFTDetails(mint))
  const { publicKey } = useWallet()

  if (!details) {
    return <Typography>Unable to fecth {mint}</Typography>
  }

  return (
    <Box mx={1}>
      <ImageTradeContainer>
        <div>
          <img
            alt={details.data.name || ''}
            src={details.offChainData.image}
            height={500}
          />
          <h1>{details.data.name}</h1>
        </div>
        {publicKey && (
          <Suspense fallback={<CircularProgress />}>
            <TradeNFT mint={mint} publicKey={publicKey} />
          </Suspense>
        )}
      </ImageTradeContainer>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: '#2196f3' }}>
                  <PeopleAltIcon />
                </Avatar>
              }
              title="Creators"
            />
            <CardContent>
              <List dense={true} disablePadding>
                {details.data.creators?.map((e) => (
                  <ListItem
                    key={e.address}
                    secondaryAction={
                      <Typography variant="subtitle2">{e.share}%</Typography>
                    }
                  >
                    {e.verified ? (
                      <ListItemIcon>
                        <CheckCircleIcon />
                      </ListItemIcon>
                    ) : null}
                    <ListItemText
                      inset={!e.verified}
                      primary={shortenPublicKey(e.address)}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: '#f50057' }}>
                  <FactCheckIcon />
                </Avatar>
              }
              title="Attributes"
            />
            <CardContent>
              <Grid container spacing={2}>
                {details.offChainData.attributes?.map((e) => (
                  <Grid
                    item
                    xs={6}
                    md={4}
                    key={e.trait_type}
                    sx={{ padding: 2 }}
                  >
                    <Typography align="center" variant="body1" gutterBottom>
                      <strong>{e.trait_type}</strong>
                    </Typography>
                    <Typography align="center" variant="body2">
                      {e.value}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Details
