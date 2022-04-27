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
import { ConfirmedTransactionMeta, TransactionSignature } from '@solana/web3.js'
import React from 'react'
import { useBlock } from '../../store'
import { AccountLink, ExplorerCard, TxLink } from '../common'

type TransactionWithInvocations = {
  index: number
  signature?: TransactionSignature
  meta: ConfirmedTransactionMeta | null
  invocations: Map<string, number>
}

interface SlotTransactionsProps {
  slot: number
}

export const SlotTransactionsContent = ({ slot }: SlotTransactionsProps) => {
  const block = useBlock(slot)

  if (!block) {
    return <div>Block ${slot} not found</div>
  }

  const { transactions, invokedPrograms } = React.useMemo(() => {
    const invokedPrograms = new Map<string, number>()

    const transactions: TransactionWithInvocations[] = block.transactions.map(
      (tx, index) => {
        let signature: TransactionSignature | undefined
        if (tx.transaction.signatures.length > 0) {
          signature = tx.transaction.signatures[0]
        }

        let programIndexes = tx.transaction.message.instructions.map(
          (ix) => ix.programIdIndex
        )
        programIndexes.concat(
          tx.meta?.innerInstructions?.flatMap((ix) => {
            return ix.instructions.map((ix) => ix.programIdIndex)
          }) || []
        )

        const indexMap = new Map<number, number>()
        programIndexes.forEach((programIndex) => {
          const count = indexMap.get(programIndex) || 0
          indexMap.set(programIndex, count + 1)
        })

        const invocations = new Map<string, number>()
        for (const [i, count] of indexMap.entries()) {
          const programId = tx.transaction.message.accountKeys[i].toBase58()
          invocations.set(programId, count)
          const programTransactionCount = invokedPrograms.get(programId) || 0
          invokedPrograms.set(programId, programTransactionCount + 1)
        }

        return {
          index,
          signature,
          meta: tx.meta,
          invocations,
        }
      }
    )
    return { transactions, invokedPrograms }
  }, [block])

  const top10Transactions = transactions.slice(0, 10)

  const rows = top10Transactions.map((transaction) => {
    if (!transaction) {
      return {}
    }

    const { meta, signature: txSignature } = transaction || {}

    const { err } = meta || {}

    const result = err ? (
      <Chip color="error" label="Error" />
    ) : (
      <Chip color="success" label="Sucess" />
    )

    const signature = txSignature ? (
      <TxLink to={txSignature} ellipsis={[30, 0]} />
    ) : null

    const entries = [...transaction.invocations.entries()]
    entries.sort()

    const instructions =
      transaction.invocations.size === 0
        ? 'NA'
        : entries.map(([programId, count], i) => {
            return (
              <div key={i} className="d-flex align-items-center">
                <AccountLink to={programId} allowCopy />
                <span className="ms-2 text-muted">{`(${count})`}</span>
              </div>
            )
          })

    const row = {
      result,
      signature,
      instructions,
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
