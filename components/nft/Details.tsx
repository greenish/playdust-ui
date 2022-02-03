import styled from '@emotion/styled'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material'
import { useWallet } from '@solana/wallet-adapter-react'
import { Suspense } from 'react'
import { useRecoilValue } from 'recoil'
import { fetchNFTDetails } from '../../store'
import Image from '../utils/image'
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
          <Image
            alt={details.data.name}
            url={details.offChainData.image}
            style={{ height: 500 }}
          />
          <h1>{details.data.name}</h1>
        </div>
        {publicKey && (
          <Suspense fallback={<CircularProgress />}>
            <TradeNFT mint={mint} publicKey={publicKey} />
          </Suspense>
        )}
      </ImageTradeContainer>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Creators</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List dense={true}>
            {details.data.creators?.map((e) => (
              <ListItem key={e.address}>
                <ListItemText primary={e.address} />
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>Attributes</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List dense={true}>
            {details.offChainData.attributes?.map((e) => (
              <ListItem key={e.trait_type}>
                <ListItemText primary={e.trait_type} secondary={e.value} />
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
    </Box>
  )
}

export default Details
