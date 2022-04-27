import CheckIcon from '@mui/icons-material/Check'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import SearchMetadata from '../../../../../common/types/SearchMetadata'
import { AccountLink } from '../../../common'

interface CreatorInfo {
  address: string
  verified: boolean
  share: number
}

interface CreatorsProps {
  details?: SearchMetadata
}

export const Creators = ({ details }: CreatorsProps) => {
  return (
    <Accordion defaultExpanded={true} square={true} disableGutters={true}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>Creators</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Creator Address</TableCell>
              <TableCell>Royalty</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(details?.data?.creators || []).map((creator: CreatorInfo) => (
              <TableRow key={creator.address}>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  <Stack direction="row" alignItems="center" gap={1}>
                    {creator.verified ? (
                      <CheckIcon />
                    ) : (
                      <ReportGmailerrorredIcon />
                    )}{' '}
                    <AccountLink to={creator.address} />
                  </Stack>
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  {creator.share}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </AccordionDetails>
    </Accordion>
  )
}
