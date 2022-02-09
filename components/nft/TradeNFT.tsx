import styled from '@emotion/styled'
import { Button, Divider, MenuItem, Select, TextField } from '@mui/material'
import { PublicKey } from '@solana/web3.js'
import React, { useMemo, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import {
  executeNFTSale,
  makeNFTBid,
  makeNFTListing,
} from '../../helpers/auctionHouseApi'
import useConfirmTransaction from '../../hooks/useConfirmTransaction'
import { fetchOwnedOnchain } from '../../store'
import currencyToken, {
  allCurrencies,
  currency,
  CurrencyToken,
} from '../../store/currencyToken'

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
}

const TradeNFT = ({ mint, publicKey }: TradeNFTProps) => {
  const owned = useRecoilValue(fetchOwnedOnchain(publicKey))
  const activeCurrencyToken = useRecoilValue(currencyToken)
  const allCurrencyTokens = useRecoilValue(allCurrencies)
  const confirmTransaction = useConfirmTransaction()
  const [currencyState, setCurrencyState] = useRecoilState(currency)
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
        <Select
          value={currencyState}
          sx={{ marginRight: 1 }}
          onChange={(e) => setCurrencyState(e.target.value)}
        >
          <MenuItem value="SOL">SOL</MenuItem>
          {allCurrencyTokens.map((token: CurrencyToken) => (
            <MenuItem key={token.tokenSymbol} value={token.tokenSymbol}>
              {token.tokenSymbol}
            </MenuItem>
          ))}
        </Select>
        <Button
          variant="contained"
          size="large"
          onClick={() =>
            confirmTransaction(
              makeNFTListing(
                publicKey.toBase58(),
                mint,
                listPrice,
                activeCurrencyToken.auctionHouseKey
              ),
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
        <Select
          value={currencyState}
          sx={{ marginRight: 1 }}
          onChange={(e) => setCurrencyState(e.target.value)}
        >
          <MenuItem value="SOL">SOL</MenuItem>
          {allCurrencyTokens.map((token: CurrencyToken) => (
            <MenuItem key={token.tokenSymbol} value={token.tokenSymbol}>
              {token.tokenSymbol}
            </MenuItem>
          ))}
        </Select>
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
                buyerAddress,
                activeCurrencyToken.auctionHouseKey
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
        <Select
          value={currencyState}
          sx={{ marginRight: 1 }}
          onChange={(e) => setCurrencyState(e.target.value)}
        >
          {allCurrencyTokens.map((token: CurrencyToken) => (
            <MenuItem key={token.tokenSymbol} value={token.tokenSymbol}>
              {token.tokenSymbol}
            </MenuItem>
          ))}
        </Select>
        <Button
          variant="contained"
          size="large"
          onClick={() =>
            confirmTransaction(
              makeNFTBid(
                publicKey.toBase58(),
                mint,
                bid,
                activeCurrencyToken.auctionHouseKey
              ),
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
