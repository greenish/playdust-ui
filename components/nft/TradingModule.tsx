import styled from '@emotion/styled'

import { FC, useState } from 'react'
import { TextField, InputAdornment, Button, Divider } from '@mui/material'
import { TransactionSignature, Transaction } from '@solana/web3.js'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'

const ItemContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 0;
`

interface TradingModuleProps {
  id: string
}

const TradingModule: FC<TradingModuleProps> = ({ id }: TradingModuleProps) => {
  const [offer, setOffer] = useState(0)
  const [listPrice, setListPrice] = useState(0)
  const [salePrice, setSalePrice] = useState(0)
  const [buyerAddress, setBuyerAddress] = useState('')

  const { connection } = useConnection()
  const { publicKey, signTransaction, connected } = useWallet()

  const handleTransaction = async (type: string) => {
    const price =
      type === 'buy' ? offer : type === 'list' ? listPrice : salePrice
    let signature: TransactionSignature = ''

    try {
      if (signTransaction && publicKey) {
        // request to internal api middleware
        const data = await fetch(`/api/auctionHouse/${type}`, {
          method: 'POST',
          body: JSON.stringify({
            wallet: publicKey.toBase58(),
            price: price,
            mint: id,
            sellerWallet: type === 'sale' ? publicKey.toBase58() : null,
            buyerWallet: type === 'sale' ? buyerAddress : null,
          }),
        }).then((res) => res.json())

        // deserialize transaction made from AH server
        const transaction = Transaction.from(data)

        // sign off the transaction with connected wallet
        await signTransaction(transaction)

        signature = await connection.sendRawTransaction(
          transaction.serialize(),
          { skipPreflight: true }
        )

        await connection.confirmTransaction(signature, 'processed')
      }
    } catch (error: any) {
      console.error('error', `Transaction failed! ${error?.message}`, signature)
      return
    }
  }

  return (
    <div>
      <ItemContainer>
        <TextField
          label="Offer price"
          sx={{ m: 1, width: '25ch' }}
          value={offer}
          type="number"
          onChange={(e) => setOffer(Number(e.target.value))}
          InputProps={{
            endAdornment: <InputAdornment position="end">SOL</InputAdornment>,
          }}
        />
        <Button
          variant="contained"
          size="large"
          onClick={() => handleTransaction('buy')}
        >
          Offer
        </Button>
      </ItemContainer>
      <Divider />
      <ItemContainer>
        <TextField
          label="List price"
          sx={{ m: 1, width: '25ch' }}
          value={listPrice}
          type="number"
          onChange={(e) => setListPrice(Number(e.target.value))}
          InputProps={{
            endAdornment: <InputAdornment position="end">SOL</InputAdornment>,
          }}
        />
        <Button
          variant="contained"
          size="large"
          onClick={() => handleTransaction('list')}
        >
          List
        </Button>
      </ItemContainer>
      <Divider />
      <ItemContainer>
        <TextField
          label="Sale price"
          sx={{ m: 1, width: '25ch' }}
          value={salePrice}
          type="number"
          onChange={(e) => setSalePrice(Number(e.target.value))}
          InputProps={{
            endAdornment: <InputAdornment position="end">SOL</InputAdornment>,
          }}
        />
        <TextField
          label="Buyer Address"
          sx={{ m: 1, width: '25ch' }}
          value={buyerAddress}
          onChange={(e) => setBuyerAddress(e.target.value)}
        />
        <Button
          variant="contained"
          size="large"
          onClick={() => handleTransaction('sale')}
        >
          Sale
        </Button>
      </ItemContainer>
    </div>
  )
}

export default TradingModule
