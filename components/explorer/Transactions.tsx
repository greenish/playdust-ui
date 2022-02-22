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
import { PublicKey } from '@solana/web3.js'
import { DateTime } from 'luxon'
import { lamportsToSol, pubkeyToString } from '../../helpers/utils'
import { useAccountHistory } from '../../store'
import { ExplorerCard } from './ExplorerCard'
import { AccountLink, SlotLink, TxLink } from './Links'

interface TransactionsProps {
  pubkey: PublicKey
}

export const TransactionsContent = ({ pubkey }: TransactionsProps) => {
  const { signatures, transactions } = useAccountHistory(pubkey)

  // Use to x-ref signatures against transactions
  const signatureMap = signatures.reduce(
    (accum: Record<string, any>, signature) => {
      accum[signature.signature] = signature
      return accum
    },
    {}
  )

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

    const relativeTime = blockTime
      ? DateTime.fromMillis(blockTime * 1000).toRelative()
      : ''

    const status = err ? (
      <Chip color="error" label="Error" />
    ) : (
      <Chip color="success" label="Sucess" />
    )

    const signature = <TxLink to={signatures[0]} ellipsis={[30, 0]} />

    const block = <SlotLink to={slot} />

    const time = <>{relativeTime}</>

    const _instructions = (
      <pre style={{ display: 'none' }}>{JSON.stringify(instructions)}</pre>
    )

    const by = <AccountLink to={byPubkey} allowCopy ellipsis={[6, 6]} />

    const _fee = <>{fee ? lamportsToSol(fee) : null}</>

    const row = {
      status,
      signature,
      block,
      time,
      instructions: _instructions,
      by,
      fee: _fee,
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
              {row.status}
            </TableCell>
            <TableCell>{row.signature}</TableCell>
            <TableCell>{row.block}</TableCell>
            <TableCell>{row.time}</TableCell>
            <TableCell>{row.instructions}</TableCell>
            <TableCell>{row.by}</TableCell>
            <TableCell>{row.fee}</TableCell>
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
