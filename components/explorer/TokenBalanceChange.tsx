import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { useRawTransaction } from '../../store/fetchTransaction'
import { ExplorerCard } from './ExplorerCard'
import { AccountLink } from './Links'

interface TokenBalanceChangeProps {
  signature: string
}

export const TokenBalanceChangeContent = ({
  signature,
}: TokenBalanceChangeProps) => {
  const tx = useRawTransaction(signature)

  if (!tx) {
    return <div>No data available</div>
  }

  const {
    meta,
    transaction: {
      message: {
        header: {
          numReadonlySignedAccounts,
          numReadonlyUnsignedAccounts,
          numRequiredSignatures,
        },
      },
    },
  } = tx

  const { postTokenBalances, preTokenBalances } = meta || {}

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Address</TableCell>
            <TableCell>Balance Before</TableCell>
            <TableCell>Balance After</TableCell>
            <TableCell>Change</TableCell>
            <TableCell>Token</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(preTokenBalances || []).map((preTokenBalance: any, idx: number) => {
            const {
              accountIndex,
              mint,
              owner,
              uiTokenAmount: { amount, decimals, uiAmount, uiAmountString },
            } = preTokenBalance

            const postTokenBalance =
              postTokenBalances?.[idx]?.uiTokenAmount?.uiAmount ?? 0

            return (
              <TableRow
                key={idx}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>{owner}</TableCell>
                <TableCell>{uiAmount}</TableCell>
                <TableCell>{postTokenBalance}</TableCell>
                <TableCell>{postTokenBalance - uiAmount}</TableCell>
                <TableCell>
                  <AccountLink to={mint} />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export const TokenBalanceChange = (props: TokenBalanceChangeProps) => {
  return (
    <ExplorerCard skeleton="table">
      <Box
        sx={{
          bgcolor: 'background.paper',
        }}
        p={4}
      >
        <Typography variant="h5" component="h2" gutterBottom>
          Token Balance Change
        </Typography>
        <TokenBalanceChangeContent {...props} />
      </Box>
    </ExplorerCard>
  )
}
