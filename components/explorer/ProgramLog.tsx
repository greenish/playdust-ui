import { Box, Typography } from '@mui/material'
import { useRawTransaction } from '../../store/fetchTransaction'
import { ExplorerCard } from './ExplorerCard'

interface ProgramLogProps {
  signature: string
}

export const ProgramLogContent = ({ signature }: ProgramLogProps) => {
  const tx = useRawTransaction(signature)

  if (!tx) {
    return <div>No data available</div>
  }

  const { meta } = tx

  const { logMessages = [] } = meta || {}

  return (
    <>
      {(logMessages || []).map((logMessage: string, idx: number) => {
        return <div key={idx}>{logMessage}</div>
      })}
    </>
  )
}

export const ProgramLog = (props: ProgramLogProps) => {
  return (
    <ExplorerCard skeleton="table">
      <Box
        sx={{
          bgcolor: 'background.paper',
        }}
        p={4}
      >
        <Typography variant="h5" component="h2" gutterBottom>
          Program Log
        </Typography>
        <ProgramLogContent {...props} />
      </Box>
    </ExplorerCard>
  )
}
