import {
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { useBlock } from '../store'
import { ExplorerCard, TxLink } from './'

interface SlotTransactionsProps {
  slot: number
}

export const SlotTransactionsContent = ({ slot }: SlotTransactionsProps) => {
  const block = useBlock(slot)

  if (!block) {
    return <div>Block ${slot} not found</div>
  }

  const { transactions } = block

  const top10Transactions = transactions.slice(0, 10)

  const rows = top10Transactions.map((transaction) => {
    if (!transaction) {
      return {}
    }

    const { meta, transaction: innerTransaction } = transaction || {}

    const { err } = meta || {}

    const { message, signatures } = innerTransaction || {}

    const { instructions } = message || {}

    const result = err ? (
      <Chip color="error" label="Error" />
    ) : (
      <Chip color="success" label="Sucess" />
    )

    const signature = <TxLink to={signatures[0]} ellipsis={[30, 0]} />

    const _instructions = (
      <pre style={{ display: 'none' }}>{JSON.stringify(instructions)}</pre>
    )

    const row = {
      result,
      signature,
      instructions: _instructions,
    }

    return row
  })

  const tableRows =
    rows.length > 0 ? (
      rows.map((row: any, idx: number) => {
        return (
          <TableRow
            key={idx}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
            <TableCell component="th" scope="row">
              {row.result}
            </TableCell>
            <TableCell>{row.signature}</TableCell>
            <TableCell>{row.instructions}</TableCell>
          </TableRow>
        )
      })
    ) : (
      <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
        <TableCell colSpan={6}>No data available</TableCell>
      </TableRow>
    )

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Result</TableCell>
            <TableCell>Transaction Signature</TableCell>
            <TableCell>Invoked Programs</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{tableRows}</TableBody>
      </Table>
    </TableContainer>
  )
}

export const SlotTransactions = (props: SlotTransactionsProps) => {
  return (
    <ExplorerCard skeleton="table">
      <SlotTransactionsContent {...props} />
    </ExplorerCard>
  )
}
