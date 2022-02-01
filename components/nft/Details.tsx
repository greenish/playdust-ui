import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material'
import { useRecoilValueLoadable } from 'recoil'
import { fetchNftDetailsOnchain } from '../../store'
import Image from '../utils/image'

interface DetailsProps {
  mint: string
}

const Details = ({ mint }: DetailsProps) => {
  const details = useRecoilValueLoadable(fetchNftDetailsOnchain(mint))

  switch (details.state) {
    case 'hasValue':
      const content = details.contents

      if (!content) {
        return null
      }

      return (
        <Box mx={1}>
          <Image
            alt={content.onchain.data.name}
            url={content.offchain.image}
            style={{ width: 500, height: 500 }}
          />
          <h1>{content.onchain.data.name}</h1>

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
                {content.onchain.data.creators?.map((e) => (
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
                {content.offchain.attributes.map((e) => (
                  <ListItem key={e.trait_type}>
                    <ListItemText primary={e.trait_type} secondary={e.value} />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        </Box>
      )
    case 'loading':
      return <></>
    case 'hasError':
      return <></>
  }
}

export default Details
