import { Chip } from '@mui/material'
import { PublicKey } from '@solana/web3.js'
import { pubkeyToString, toRelative } from '../../../helpers/utils'
import { useRawAccountHistory } from '../store'
import { ExplorerCard } from './ExplorerCard'
import { AccountLink, SlotLink, TxLink } from './Links'
import { SolBalance } from './SolBalance'
import {
  DataCell,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from './Table'

interface TransactionsProps {
  pubkey: PublicKey
}

export const TransactionsContent = ({ pubkey }: TransactionsProps) => {
  const { transactions } = useRawAccountHistory(pubkey)

  const rows = transactions.map((transaction) => {
    if (!transaction) {
      return {}
    }

    const {
      blockTime,
      meta,
      slot,
      transaction: innerTransaction,
    } = transaction || {}

    const { err, fee } = meta || {}

    const { message, signatures } = innerTransaction || {}

    const { accountKeys, instructions } = message || {}

    const byPubkey = pubkeyToString(accountKeys?.[0])

    const relativeTime = toRelative(blockTime)

    const status = err ? (
      <Chip color="error" label="Error" size="small" />
    ) : (
      <Chip color="success" label="Sucess" size="small" />
    )

    const signature = <TxLink to={signatures[0]} ellipsis={[30, 0]} allowCopy />

    const block = <SlotLink to={slot} allowCopy />

    const time = <>{relativeTime}</>

    const formattedInstructions = (
      <pre style={{ display: 'none' }}>{JSON.stringify(instructions)}</pre>
    )

    const by = <AccountLink to={byPubkey} allowCopy ellipsis={[6, 6]} />

    const feeAsSol = <SolBalance lamports={fee} />

    const row = {
      status,
      signature,
      block,
      time,
      instructions: formattedInstructions,
      by,
      fee: feeAsSol,
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
            <DataCell component="th" scope="row">
              {row.status}
            </DataCell>
            <DataCell>{row.signature}</DataCell>
            <DataCell>{row.block}</DataCell>
            <DataCell>{row.time}</DataCell>
            <DataCell>{row.instructions}</DataCell>
            <DataCell>{row.by}</DataCell>
            <DataCell>{row.fee}</DataCell>
          </TableRow>
        )
      })
    ) : (
      <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
        <TableCell colSpan={6}>No data available</TableCell>
      </TableRow>
    )

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Status</TableCell>
            <TableCell>Signature</TableCell>
            <TableCell>Block</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Instructions</TableCell>
            <TableCell>By</TableCell>
            <TableCell>Fee (SOL)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{tableRows}</TableBody>
      </Table>
    </TableContainer>
  )
}

export const Transactions = (props: TransactionsProps) => {
  return (
    <ExplorerCard skeleton="table">
      <TransactionsContent {...props} />
    </ExplorerCard>
  )
}
