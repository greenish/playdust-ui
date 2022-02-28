import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { useMemo } from 'react'
import { useBlock } from '../../store'
import { AccountLink, ExplorerCard } from './'

type AccountStats = {
  reads: number
  writes: number
}

interface SlotAccountsProps {
  slot: number
}

export const SlotAccountsContent = ({ slot }: SlotAccountsProps) => {
  const block = useBlock(slot)

  const accountStats = useMemo(() => {
    if (!block) {
      return []
    }

    const statsMap = new Map<string, AccountStats>()

    block.transactions.forEach((tx) => {
      const message = tx.transaction.message

      const txSet = new Map<string, boolean>()

      message.instructions.forEach((ix) => {
        ix.accounts.forEach((index) => {
          let address
          try {
            address = message.accountKeys[index].toBase58()
          } catch (err) {
            address = '???'
          }
          txSet.set(address, message.isAccountWritable(index))
        })
      })

      txSet.forEach((isWritable, address) => {
        const stats = statsMap.get(address) || { reads: 0, writes: 0 }
        if (isWritable) {
          stats.writes++
        } else {
          stats.reads++
        }
        statsMap.set(address, stats)
      })
    })

    const accountEntries = []
    for (let entry of statsMap) {
      accountEntries.push(entry)
    }

    accountEntries.sort((a, b) => {
      const aCount = a[1].reads + a[1].writes
      const bCount = b[1].reads + b[1].writes
      if (aCount < bCount) return 1
      if (aCount > bCount) return -1
      return 0
    })

    return accountEntries
  }, [block])

  if (!block) {
    return <div>Block ${slot} not found</div>
  }

  const totalTransactions = block.transactions.length

  const rows = accountStats.slice(0, 25).map(([address, { writes, reads }]) => {
    const row = {
      key: address,
      account: <AccountLink to={address} allowCopy />,
      readWriteCount: writes,
      readOnlyCount: reads,
      totalCount: writes + reads,
      percentOfTransactions: (
        (100 * (writes + reads)) /
        totalTransactions
      ).toFixed(2),
    }

    return row
  })

  const tableRows = rows.map((row) => {
    return (
      <TableRow
        key={row.key}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        <TableCell component="th" scope="row">
          {row.account}
        </TableCell>
        <TableCell>{row.readWriteCount}</TableCell>
        <TableCell>{row.readOnlyCount}</TableCell>
        <TableCell>{row.totalCount}</TableCell>
        <TableCell>{row.percentOfTransactions}</TableCell>
      </TableRow>
    )
  })

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Account</TableCell>
            <TableCell>Read-Write Count</TableCell>
            <TableCell>Read-Only Count</TableCell>
            <TableCell>Total Count</TableCell>
            <TableCell>% of Transactions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{tableRows}</TableBody>
      </Table>
    </TableContainer>
  )
}

export const SlotAccounts = (props: SlotAccountsProps) => {
  return (
    <ExplorerCard skeleton="table">
      <SlotAccountsContent {...props} />
    </ExplorerCard>
  )
}
