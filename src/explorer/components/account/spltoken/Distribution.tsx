import { Chip, Paper } from '@mui/material'
import { ParsedAccountData, PublicKey } from '@solana/web3.js'
import BigNumber from 'bignumber.js'
import { normalizeTokenAmount } from '../../../../../helpers/utils'
import {
  TokenAccountBalancePairWithOwner,
  useAccountInfo,
  useLargestAccounts,
} from '../../../store'
import { AccountLink } from '../../Links'
import {
  DataCell,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '../../Table'

interface DistributionProps {
  pubkey: PublicKey
}

export const Distribution = ({ pubkey }: DistributionProps) => {
  const account = useAccountInfo(pubkey)
  const largestAccounts = useLargestAccounts(pubkey)

  const mintInfo = (account?.data as ParsedAccountData)?.parsed?.info

  const supplyTotal = normalizeTokenAmount(mintInfo.supply, mintInfo.decimals)

  // Find largest fixed point in accounts array
  const balanceFixedPoint = largestAccounts.reduce(
    (prev: number, current: TokenAccountBalancePairWithOwner) => {
      const amount = `${current.uiAmountString}`
      const length = amount.length
      const decimalIndex = amount.indexOf('.')
      if (decimalIndex >= 0 && length - decimalIndex - 1 > prev) {
        return length - decimalIndex - 1
      }
      return prev
    },
    0
  )

  const rows = largestAccounts.map((largestAccount, idx) => {
    const { address, owner, uiAmountString } = largestAccount

    const balance =
      uiAmountString &&
      new BigNumber(uiAmountString).toFormat(balanceFixedPoint)

    let percent = '-'
    if (supplyTotal > 0 && uiAmountString) {
      let uiAmountPercent = new BigNumber(uiAmountString)
        .times(100)
        .dividedBy(supplyTotal)

      percent = `${uiAmountPercent.toFormat(3)}%`

      if (parseFloat(percent) === 0 && new BigNumber(uiAmountString).gt(0)) {
        percent = `~${percent}`
      }
    }

    const row: Record<string, any> = {}

    row.rank = <Chip label={idx + 1} size="small" />

    row.address = <AccountLink to={address.toBase58()} allowCopy />

    row.owner = owner ? <AccountLink to={owner} allowCopy /> : null

    row.balance = <>{balance}</>

    row.percentOfTotalSupply = <>{percent}</>

    return row
  })

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Rank</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Owner</TableCell>
            <TableCell>Balance (USDT)</TableCell>
            <TableCell>% of Total Supply</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row: any, idx: number) => {
            return (
              <TableRow
                key={idx}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <DataCell component="th" scope="row">
                  {row.rank}
                </DataCell>
                <DataCell>{row.address}</DataCell>
                <DataCell>{row.owner}</DataCell>
                <DataCell>{row.balance}</DataCell>
                <DataCell>{row.percentOfTotalSupply}</DataCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
