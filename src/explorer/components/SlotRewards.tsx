import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { useBlock } from '../store'
import { AccountLink, ExplorerCard } from './'

interface SlotRewardsProps {
  slot: number
}

export const SlotRewardsContent = ({ slot }: SlotRewardsProps) => {
  const block = useBlock(slot)

  if (!block) {
    return <div>Block ${slot} not found</div>
  }

  const { rewards } = block

  const top10Rewards = rewards ? rewards.slice(0, 10) : []

  const rows = top10Rewards.map((reward: any) => {
    const { lamports, postBalance, pubkey, rewardType } = reward

    const row: any = {}

    row.addressType = <AccountLink to={pubkey} />

    row.type = <>{rewardType}</>

    row.amount = <>{lamports}</>

    row.newBalance = <>{postBalance}</>

    row.percentChange = <>??%r</>

    return row
  })

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Address</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>New Balance</TableCell>
            <TableCell>Percent Change</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row: any, idx: number) => {
            return (
              <TableRow
                key={idx}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.addressType}
                </TableCell>
                <TableCell>{row.type}</TableCell>
                <TableCell>{row.amount}</TableCell>
                <TableCell>{row.newBalance}</TableCell>
                <TableCell>{row.percentChange}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export const SlotRewards = (props: SlotRewardsProps) => {
  return (
    <ExplorerCard skeleton="table">
      <SlotRewardsContent {...props} />
    </ExplorerCard>
  )
}
