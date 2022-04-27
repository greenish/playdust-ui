import { Chip } from '@mui/material'
import { PublicKey } from '@solana/web3.js'
import { DateTime } from 'luxon'
import { normalizeTokenAmount } from '../../../../common/helpers/utils'
import { useAccountHistory, useTokenRegistry } from '../../../store'
import {
  AccountLink,
  DataCell,
  ExplorerCard,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TxLink,
} from '../../common'
import { getTransfers, MintDetails } from './helpers'

interface TransfersProps {
  pubkey: PublicKey
}

export const TransfersContent = ({ pubkey }: TransfersProps) => {
  const { transactions } = useAccountHistory(pubkey)
  const tokenRegistry = useTokenRegistry()

  const mintDetails = tokenRegistry.get(pubkey.toBase58())

  const mintMap = new Map<string, MintDetails>()

  const rows: any[] = []

  transactions.forEach((parsed) => {
    const transfers = getTransfers(pubkey, parsed, mintMap)

    ;(transfers || []).forEach(({ transfer, index, childIndex }) => {
      const key = '' + index + (childIndex || '')

      let units = 'Tokens'
      let amountString

      if (mintDetails?.symbol) {
        units = mintDetails.symbol
      }

      if ('tokenAmount' in transfer) {
        amountString = transfer.tokenAmount.uiAmountString
      } else {
        let decimals = 0

        if (mintDetails?.decimals) {
          decimals = mintDetails.decimals
        } else if (mintMap.has(transfer.source)) {
          decimals = mintMap.get(transfer.source)?.decimals || 0
        } else if (mintMap.has(transfer.destination)) {
          decimals = mintMap.get(transfer.destination)?.decimals || 0
        }

        amountString = new Intl.NumberFormat('en-US', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }).format(normalizeTokenAmount(transfer.amount, decimals))
      }

      const { blockTime, meta, transaction: innerTransaction } = parsed || {}

      const { err } = meta || {}

      const { signatures } = innerTransaction || {}

      const relativeTime = blockTime
        ? DateTime.fromMillis(blockTime * 1000).toRelative()
        : ''

      const signature =
        signatures && signatures[0] ? (
          <TxLink to={signatures[0]} ellipsis={[30, 0]} allowCopy />
        ) : null

      const time = <>{relativeTime}</>

      const source = (
        <AccountLink to={transfer.source} allowCopy ellipsis={[6, 6]} />
      )

      const destination = (
        <AccountLink to={transfer.destination} allowCopy ellipsis={[6, 6]} />
      )

      const amount = (
        <>
          {amountString} {units}
        </>
      )

      const result = err ? (
        <Chip color="error" label="Error" size="small" />
      ) : (
        <Chip color="success" label="Sucess" size="small" />
      )

      rows.push({
        key,
        signature,
        time,
        source,
        destination,
        amount,
        result,
      })
    })
  })

  const tableRows =
    rows.length > 0 ? (
      rows.map((row: any, idx: number) => {
        return (
          <TableRow
            key={row.key}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
            <DataCell>{row.signature}</DataCell>
            <DataCell>{row.time}</DataCell>
            <DataCell>{row.source}</DataCell>
            <DataCell>{row.destination}</DataCell>
            <DataCell>{row.amount}</DataCell>
            <DataCell>{row.result}</DataCell>
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
            <TableCell>Signature</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Source</TableCell>
            <TableCell>Destination</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Result</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{tableRows}</TableBody>
      </Table>
    </TableContainer>
  )
}

export const Transfers = (props: TransfersProps) => {
  return (
    <ExplorerCard skeleton="table">
      <TransfersContent {...props} />
    </ExplorerCard>
  )
}
