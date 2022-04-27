import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { useBlock } from '../../store'
import { AccountLink, ExplorerCard } from '../common'

interface SlotProgramsProps {
  slot: number
}

export const SlotProgramsContent = ({ slot }: SlotProgramsProps) => {
  const block = useBlock(slot)

  if (!block) {
    return <div>Block ${slot} not found</div>
  }

  const totalTransactions = block.transactions.length
  const txSuccesses = new Map<string, number>()
  const txFrequency = new Map<string, number>()
  const ixFrequency = new Map<string, number>()

  let totalInstructions = 0
  block.transactions.forEach((tx) => {
    const message = tx.transaction.message
    totalInstructions += message.instructions.length
    const programUsed = new Set<string>()

    const trackProgram = (index: number) => {
      if (index >= message.accountKeys.length) return
      const programId = message.accountKeys[index]
      let programAddress: string
      try {
        programAddress = programId.toBase58()
      } catch (err) {
        programAddress = '???'
      }
      programUsed.add(programAddress)
      const frequency = ixFrequency.get(programAddress)
      ixFrequency.set(programAddress, frequency ? frequency + 1 : 1)
    }

    message.instructions.forEach((ix) => trackProgram(ix.programIdIndex))
    tx.meta?.innerInstructions?.forEach((inner) => {
      totalInstructions += inner.instructions.length
      inner.instructions.forEach((innerIx) =>
        trackProgram(innerIx.programIdIndex)
      )
    })

    const successful = tx.meta?.err === null
    programUsed.forEach((programId) => {
      const frequency = txFrequency.get(programId)
      txFrequency.set(programId, frequency ? frequency + 1 : 1)
      if (successful) {
        const count = txSuccesses.get(programId)
        txSuccesses.set(programId, count ? count + 1 : 1)
      }
    })
  })

  const programEntries = []
  for (let entry of txFrequency) {
    programEntries.push(entry)
  }

  programEntries.sort((a, b) => {
    if (a[1] < b[1]) return 1
    if (a[1] > b[1]) return -1
    return 0
  })

  const rows = programEntries.map(([programId, txFreq]) => {
    const ixFreq = ixFrequency.get(programId) as number
    const successes = txSuccesses.get(programId) || 0

    const row = {
      program: <AccountLink to={programId} allowCopy />,
      transactionCount: txFreq,
      transactionCountPercentOfTotal: (
        (100 * txFreq) /
        totalTransactions
      ).toFixed(2),
      instructionCount: ixFreq,
      instructionCountPercentOfTotal: (
        (100 * ixFreq) /
        totalInstructions
      ).toFixed(2),
      successRate: ((100 * successes) / txFreq).toFixed(0),
    }

    return row
  })

  const tableRows = rows.map((row, idx) => {
    return (
      <TableRow
        key={idx}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        <TableCell component="th" scope="row">
          {row.program}
        </TableCell>
        <TableCell>{row.transactionCount}</TableCell>
        <TableCell>{row.transactionCountPercentOfTotal}</TableCell>
        <TableCell>{row.instructionCount}</TableCell>
        <TableCell>{row.instructionCountPercentOfTotal}</TableCell>
        <TableCell>{row.successRate}</TableCell>
      </TableRow>
    )
  })

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Program</TableCell>
            <TableCell>Transaction Count</TableCell>
            <TableCell># of Total</TableCell>
            <TableCell>Instruction Count</TableCell>
            <TableCell>% of Total</TableCell>
            <TableCell>Success Rate</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{tableRows}</TableBody>
      </Table>
    </TableContainer>
  )
}

export const SlotPrograms = (props: SlotProgramsProps) => {
  return (
    <ExplorerCard skeleton="table">
      <SlotProgramsContent {...props} />
    </ExplorerCard>
  )
}
