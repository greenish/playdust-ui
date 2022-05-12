import styled from '@emotion/styled'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Paper,
  Typography,
} from '@mui/material'
import SearchMetadata from '../../../../../../solana/SearchMetadataType'

const Item = styled(Paper)``

interface AttributePair {
  trait_type: string
  value: string
}

type AttributeBoxProps = AttributePair

export const AttributeBox = ({ trait_type, value }: AttributeBoxProps) => {
  return (
    <Grid item xs={4}>
      <Item>
        <Typography sx={{ textTransform: 'uppercase' }}>
          {trait_type}
        </Typography>
        <Typography>{value}</Typography>
      </Item>
    </Grid>
  )
}

interface AttributesProps {
  details?: SearchMetadata
}

export const Attributes = ({ details }: AttributesProps) => {
  return (
    <Accordion defaultExpanded={true} square={true} disableGutters={true}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>Attributes</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          {(details?.offChainData?.attributes || []).map(
            (attribute: AttributePair, index: number) => (
              <AttributeBox key={index} {...attribute} />
            )
          )}
        </Grid>
      </AccordionDetails>
    </Accordion>
  )
}
