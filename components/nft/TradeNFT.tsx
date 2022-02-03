import styled from '@emotion/styled'
import { Button, Divider, InputAdornment, TextField } from '@mui/material'
import { PublicKey } from '@solana/web3.js'
import { useMemo, useState } from 'react'
import { useRecoilValue } from 'recoil'
import {
  executeNFTSale,
  makeNFTBid,
  makeNFTListing,
} from '../../helpers/auctionHouseApi'
import useConfirmTransaction from '../../hooks/useConfirmTransaction'
import { fetchOwnedOnchain } from '../../store'

const ItemsContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
`

const ItemContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 0;
`

const TextFieldContainer = styled(TextField)`
  margin: 8px;
  width: 25ch;
`

interface TradeNFTProps {
  mint: string
  publicKey: PublicKey
}

const solanaInputProps = {
  type: 'number',
  InputProps: {
    endAdornment: <InputAdornment position="end">SOL</InputAdornment>,
  },
}

const TradeNFT = ({ mint, publicKey }: TradeNFTProps) => {
  const owned = useRecoilValue(fetchOwnedOnchain(publicKey))
  const confirmTransaction = useConfirmTransaction()
  const [bid, setBid] = useState(0)
  const [listPrice, setListPrice] = useState(0)
  const [salePrice, setSalePrice] = useState(0)
  const [buyerAddress, setBuyerAddress] = useState('')

  const isOwner = useMemo(() => {
    return owned.find((entry) => entry.mint === mint)
  }, [owned])

  return isOwner ? (
    <ItemsContainer>
      <ItemContainer>
        <TextFieldContainer
          label="List price"
          value={listPrice}
          onChange={(e) => setListPrice(Number(e.target.value))}
          {...solanaInputProps}
        />
        <Button
          variant="contained"
          size="large"
          onClick={() =>
            confirmTransaction(
              makeNFTListing(publicKey.toBase58(), mint, listPrice),
              'Listing Successful',
              'Listing Unsuccessful'
            )
          }
        >
          List
        </Button>
      </ItemContainer>
      <Divider />
      <ItemContainer>
        <TextFieldContainer
          label="Sale price"
          value={salePrice}
          onChange={(e) => setSalePrice(Number(e.target.value))}
          {...solanaInputProps}
        />
        <TextFieldContainer
          label="Buyer Address"
          value={buyerAddress}
          onChange={(e) => setBuyerAddress(e.target.value)}
        />
        <Button
          variant="contained"
          size="large"
          onClick={() =>
            confirmTransaction(
              executeNFTSale(
                publicKey.toBase58(),
                mint,
                salePrice,
                buyerAddress
              ),
              'Sale Successful',
              'Sale Unsuccessful'
            )
          }
        >
          Sale
        </Button>
      </ItemContainer>
    </ItemsContainer>
  ) : (
    <ItemsContainer>
      <ItemContainer>
        <TextFieldContainer
          label="Bid price"
          value={bid}
          onChange={(e) => setBid(Number(e.target.value))}
          {...solanaInputProps}
        />
        <Button
          variant="contained"
          size="large"
          onClick={() =>
            confirmTransaction(
              makeNFTBid(publicKey.toBase58(), mint, bid),
              'Bid Placed',
              'Bid Failed'
            )
          }
        >
          Bid
        </Button>
      </ItemContainer>
    </ItemsContainer>
  )
}

export default TradeNFT
