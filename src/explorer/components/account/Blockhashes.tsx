import { ParsedAccountData, PublicKey } from '@solana/web3.js'
import { useAccountInfo } from '../../store'
import {
  DataCell,
  ExplorerCard,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '../common'

interface RecentBlockhashesEntry {
  blockhash: string
  feeCalculator: {
    lamportsPerSignature: string
  }
}

type RecentBlockhashesInfo = RecentBlockhashesEntry[]

interface BlockhashesRow {
  recency: JSX.Element
  blockhash: JSX.Element
  feeCalculator: JSX.Element
}

interface BlockhashesProps {
  pubkey: PublicKey
}

export const BlockhashesContent = ({ pubkey }: BlockhashesProps) => {
  const account = useAccountInfo(pubkey)

  const recentBlockHashes = (account?.data as ParsedAccountData).parsed.info

  const rows = (recentBlockHashes || []).map(
    (recentBlockHash: RecentBlockhashesEntry, index: number) => {
      const recency = <>{index + 1}</>
      const blockhash = <>{recentBlockHash.blockhash}</>
      const feeCalculator = (
        <>
          {recentBlockHash.feeCalculator.lamportsPerSignature} lamports per
          signature
        </>
      )

      const row = {
        recency,
        blockhash,
        feeCalculator,
      }

      return row
    }
  )

  const tableRows =
    rows.length > 0 ? (
      rows.map((row: BlockhashesRow, idx: number) => {
        return (
          <TableRow
            key={idx}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
            <DataCell>{row.recency}</DataCell>
            <DataCell>{row.blockhash}</DataCell>
            <DataCell>{row.feeCalculator}</DataCell>
          </TableRow>
        )
      })
    ) : (
      <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
        <TableCell colSpan={3}>No data available</TableCell>
      </TableRow>
    )

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Recency</TableCell>
            <TableCell>Blockhash</TableCell>
            <TableCell>Fee Calculator</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{tableRows}</TableBody>
      </Table>
    </TableContainer>
  )
}

export const Blockhashes = (props: BlockhashesProps) => {
  return (
    <ExplorerCard skeleton="table">
      <BlockhashesContent {...props} />
    </ExplorerCard>
  )
}
