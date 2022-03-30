import styled from '@emotion/styled'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import FactCheckIcon from '@mui/icons-material/FactCheck'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import {
  Avatar,
  Box,
  Button,
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
import { Suspense, useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { getNFTCensorStatus } from '../../helpers/auctionHouseApi'
import { shortenPublicKey } from '../../helpers/utils'
import FlaggedModal from '../../src/search/components/FlaggedModal'
import * as store from '../../src/search/store'
import { fetchNFTDetails } from '../../store'
import TradeNFT from './TradeNFT'

const ImageTradeContainer = styled.div`
  display: flex;
`

const ReportButton = styled(Button)`
  position: absolute;
  right: 24px;
`

const BlurImage = styled.img`
  filter: blur(1.5rem);
`

const BlurImageContainer = styled.div`
  overflow: hidden;
`

const CensoredContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
`

const VisibilityContainer = styled.div`
  cursor: pointer;
  padding: 5px 8px;
  position: absolute;
  z-index: 10;
`

interface DetailsProps {
  mint: string
}

enum NFTStatus {
  Censored,
  NSFW,
}

const Details = ({ mint }: DetailsProps) => {
  const details = useRecoilValue(fetchNFTDetails(mint))
  const [censored, setCensored] = useState(false)
  const [nsfw, setNSFW] = useState(false)
  const [visible, setVisible] = useState(false)
  const { publicKey } = useWallet()
  const openFlaggedModal = store.useOpenFlaggedModal()

  useEffect(() => {
    getNFTCensorStatus(mint)
      .then((data) => {
        if (data.type === NFTStatus.Censored) {
          setCensored(true)
        } else if (data.type === NFTStatus.NSFW) {
          setNSFW(true)
        }
      })
      .catch((e) => {
        setCensored(false)
        setNSFW(false)
      })
  }, [details])

  if (!details) {
    return <Typography>Unable to fecth {mint}</Typography>
  }

  return (
    <Box mx={1}>
      <FlaggedModal />
      <ReportButton
        onClick={() => openFlaggedModal(mint, 'NFT')}
        color="error"
        variant="outlined"
      >
        Report
      </ReportButton>
      <ImageTradeContainer>
        <div>
          {censored || nsfw ? (
            <BlurImageContainer>
              {nsfw ? (
                <VisibilityContainer>
                  {visible ? (
                    <VisibilityOffIcon onClick={() => setVisible(false)} />
                  ) : (
                    <VisibilityIcon onClick={() => setVisible(true)} />
                  )}
                </VisibilityContainer>
              ) : null}
              {visible ? (
                <img
                  alt={details.data.name || ''}
                  src={details.offChainData.image}
                  height={500}
                />
              ) : (
                <BlurImage
                  alt={details.data.name || ''}
                  src={details.offChainData.image}
                  height={500}
                />
              )}
            </BlurImageContainer>
          ) : (
            <img
              alt={details.data.name || ''}
              src={details.offChainData.image}
              height={500}
            />
          )}
          <h1>{details.data.name}</h1>
        </div>
        {publicKey && (
          <>
            {censored ? (
              <CensoredContainer>
                <Typography color="error" variant="h5">
                  NFT censored
                </Typography>
                <Typography color="#757575">Trading not available</Typography>
              </CensoredContainer>
            ) : (
              <Suspense fallback={<CircularProgress />}>
                <TradeNFT mint={mint} publicKey={publicKey} />
              </Suspense>
            )}
          </>
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
