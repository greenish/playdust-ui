import SuccessIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import { Box, Chip } from '@mui/material'
import {
  ParsedInstruction,
  PartiallyDecodedInstruction,
  PublicKey,
} from '@solana/web3.js'
import React, { useState } from 'react'
import pubkeyToString from '../../helpers/pubKeyToString'
import toRelative from '../../helpers/toRelative'
import { useAccountHistory } from '../../store'
import {
  AccountLink,
  DataCell,
  ExplorerCard,
  SlotLink,
  SolBalance,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TxLink,
} from '../common'

interface TransactionsProps {
  pubkey: PublicKey
}

interface FormattedInstructionsProps {
  instructions: (ParsedInstruction | PartiallyDecodedInstruction)[]
}

const FormattedInstructions = ({
  instructions,
}: FormattedInstructionsProps) => {
  const [showAll, setShowAll] = useState(false)

  const handleClick = () => {
    setShowAll((show) => !show)
  }

  const parsedInstructions = instructions.map((instruction) => {
    if ('parsed' in instruction) {
      return instruction.parsed.type
    }
    return 'unknown'
  })

  const total = parsedInstructions.length

  if (total === 0) {
    return null
  }

  const [first] = parsedInstructions

  return (
    <>
      <Box onClick={handleClick}>
        {first}{' '}
        {total - 1 > 0 ? (
          <Chip label={`+${total - 1}`} variant="outlined" size="small" />
        ) : null}
      </Box>
      <Box sx={{ display: showAll ? 'block' : 'none' }}>
        {parsedInstructions.map((parsedInstruction, idx) => (
          <React.Fragment key={idx}>
            <Chip label={parsedInstruction} size="small" />
            <br />
          </React.Fragment>
        ))}
      </Box>
    </>
  )
}

export const TransactionsContent = ({ pubkey }: TransactionsProps) => {
  const { transactions } = useAccountHistory(pubkey)

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

    const byPubkey = pubkeyToString(accountKeys?.[0].pubkey)

    const relativeTime = toRelative(blockTime)

    const status = err ? (
      <ErrorIcon color="error" fontSize="small" />
    ) : (
      <SuccessIcon color="success" fontSize="small" />
    )

    const signature = <TxLink to={signatures[0]} ellipsis={[30, 0]} allowCopy />

    const block = <SlotLink to={slot} allowCopy />

    const time = <>{relativeTime}</>

    const formattedInstructions = (
      <FormattedInstructions instructions={instructions} />
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
