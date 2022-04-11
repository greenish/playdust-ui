import { Box, Stack, Typography } from '@mui/material'
import { PublicKey } from '@solana/web3.js'
import { useRawTransaction } from '../store/fetchTransaction'
import { ExplorerCard } from './ExplorerCard'
import { ProgramLink } from './Links'

interface InstructionDetailsProps {
  signature: string
}

export const InstructionDetailsContent = ({
  signature,
}: InstructionDetailsProps) => {
  const tx = useRawTransaction(signature)

  if (!tx) {
    return <div>No data available</div>
  }

  const {
    transaction: {
      message: {
        instructions,
        // @ts-ignore: private, but ok
        indexToProgramIds,
      },
    },
  } = tx

  return (
    <Stack spacing={2}>
      {instructions.map((instruction: any, idx: number) => {
        const id = indexToProgramIds.get(instruction.programIdIndex)
        const pk = id ? new PublicKey(id).toString() : ''

        return (
          <Box key={idx} sx={{ border: '1px solid black' }} p={4}>
            <div>{JSON.stringify(instruction)}</div>
            <div>
              <ProgramLink to={pk} />
            </div>
          </Box>
        )
      })}
    </Stack>
  )
}

export const InstructionDetails = (props: InstructionDetailsProps) => {
  return (
    <ExplorerCard skeleton="table">
      <Box
        sx={{
          bgcolor: 'background.paper',
        }}
        p={4}
      >
        <Typography variant="h5" component="h2" gutterBottom>
          Instruction Details
        </Typography>
        <InstructionDetailsContent {...props} />
      </Box>
    </ExplorerCard>
  )
}
