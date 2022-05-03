import styled from '@emotion/styled'
import { Button, InputAdornment, TextField } from '@mui/material'
import { PublicKey } from '@solana/web3.js'
import React, { useEffect, useMemo, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { fetchOwnedOnchain } from '../../../../../../src/me/store'
import {
  cancelNFTListing,
  GetAllOrders,
  makeNFTBid,
  makeNFTListing,
} from '../../../../../App/_helpers/playdustApi'
import useConfirmTransaction from './_hooks/useConfirmTransaction'

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
  inputProps: {
    step: '0.01',
    min: '0',
  },
}

type Ask = {
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

export const TradeNFT = ({ mint, publicKey }: TradeNFTProps) => {
  const owned = useRecoilValue(fetchOwnedOnchain(publicKey))
  const confirmTransaction = useConfirmTransaction()
  const [bid, setBid] = useState(0)
  const [listPrice, setListPrice] = useState(0)
  const [ask, setAsk] = useState<Ask | null>(null)

  const isOwner = useMemo(() => {
    return owned.find((entry) => entry.mint === mint)
  }, [owned])

  useEffect(() => {
    GetAllOrders(mint).then((data) => {
      if (data.asks) {
        setAsk(data.asks.find((e: any) => e.wallet === publicKey.toBase58()))
      }
    })
  }, [])

  return isOwner ? (
    <ItemsContainer>
      <ItemContainer>
        {!ask ? (
          <>
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
          </>
        ) : (
          <Button
            variant="contained"
            size="large"
            color="error"
            onClick={() =>
              confirmTransaction(
                cancelNFTListing(publicKey.toBase58(), mint, ask.price),
                'Cancel listing Successful',
                'Cancel listing Unsuccessful'
              )
            }
          >
            Cancel Listing
          </Button>
        )}
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
