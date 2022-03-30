import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material'
import { useWallet } from '@solana/wallet-adapter-react'
import { Fragment, useEffect, useState } from 'react'
import { cancelNFTBid, GetAllOrders } from '../../helpers/auctionHouseApi'
import useConfirmTransaction from '../../hooks/useConfirmTransaction'

type OrderProps = {
  mint: string
}

type Bid = {
  id: string
  mint: string
  treasuryMint: string
  wallet: string
  txHash: string
  qty: number
  price: number
  side: string
  isActive: boolean
}

export const Orders = ({ mint }: OrderProps) => {
  const [rows, setRows] = useState<Bid[]>([])
  const { publicKey } = useWallet()
  const confirmTransaction = useConfirmTransaction()

  useEffect(() => {
    GetAllOrders(mint).then((data) => {
      if (data.bids) {
        setRows(data.bids)
      }
    })
  }, [])

  return (
    <Box mx={1}>
      <Typography gutterBottom variant="h6">
        Orders
      </Typography>
      <Paper>
        {rows.length ? (
          <List>
            {rows.map((e: any, index: number) => (
              <Fragment key={index}>
                <ListItem
                  secondaryAction={
                    <>
                      {publicKey && e.wallet === publicKey!.toBase58() ? (
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() =>
                            confirmTransaction(
                              cancelNFTBid(e.wallet, e.mint, e.price),
                              'Cancel Successful',
                              'Cancel Unsuccessful'
                            )
                          }
                        >
                          Cancel Bid
                        </Button>
                      ) : null}
                    </>
                  }
                >
                  <ListItemText
                    primary={e.wallet}
                    secondary={`Price: ${e.price}`}
                  />
                </ListItem>
                {index < rows.length - 1 ? <Divider component="li" /> : null}
              </Fragment>
            ))}
          </List>
        ) : (
          <Typography align="center" sx={{ padding: 2 }}>
            No orders for this NFT
          </Typography>
        )}
      </Paper>
    </Box>
  )
}

export default Orders
