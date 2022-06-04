import styled from '@emotion/styled';
import { Button, InputAdornment, TextField } from '@mui/material';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import React, { useEffect, useMemo, useState } from 'react';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import safePromise from '../../../../../_helpers/safePromise';
import safePubkeyString from '../../_helpers/safePubkeyString';
import tokenAccountsForWalletAtom from './_atoms/tokenAccountsForWalletAtom';
import playdustAPI from './_helpers/playdustApi';
import useConfirmTransaction from './_hooks/useConfirmTransaction';
import OrderType from './_types/OrderType';

const { cancelNFTListing, GetAllOrders, makeNFTBid, makeNFTListing } =
  playdustAPI;

const ItemsContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
`;

const ItemContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 0;
`;

const TextFieldContainer = styled(TextField)`
  margin: 8px;
  width: 25ch;
`;

interface TradeNFTProps {
  mint: string;
  publicKey: string | null;
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
};

function TradeNFT({ mint, publicKey }: TradeNFTProps) {
  const owned = useRecoilValue(tokenAccountsForWalletAtom);
  const resetOwnership = useResetRecoilState(tokenAccountsForWalletAtom);
  const walletModal = useWalletModal();
  const confirmTransaction = useConfirmTransaction();
  const [bid, setBid] = useState(0);
  const [listPrice, setListPrice] = useState(0);
  const [ask, setAsk] = useState<OrderType<'ask'> | null>(null);

  const isOwner = useMemo(
    () =>
      !!owned.find(
        (entry) =>
          entry.data.info.mint === mint &&
          entry.data.info.tokenAmount.uiAmount > 0
      ),
    [owned, mint]
  );

  useEffect(() => {
    // resetOwnership();
    safePromise(
      GetAllOrders(mint).then((data) => {
        if (data.asks) {
          setAsk(data.asks.find((order) => order.wallet === publicKey) ?? null);
        }
      })
    );
  });

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
              onClick={() => {
                if (!publicKey) {
                  walletModal.setVisible(true);
                  return;
                }

                safePromise(
                  confirmTransaction(
                    makeNFTListing(
                      safePubkeyString(publicKey),
                      mint,
                      listPrice
                    ),
                    'Listing Successful',
                    'Listing Unsuccessful'
                  )
                    .then(() => resetOwnership())
                    .catch(() => resetOwnership())
                );
              }}
            >
              List
            </Button>
          </>
        ) : (
          <Button
            variant="contained"
            size="large"
            color="error"
            onClick={() => {
              if (!publicKey) {
                walletModal.setVisible(true);
                return;
              }

              safePromise(
                confirmTransaction(
                  cancelNFTListing(
                    safePubkeyString(publicKey),
                    mint,
                    ask.price
                  ),
                  'Cancel listing Successful',
                  'Cancel listing Unsuccessful'
                )
              );
            }}
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
          onClick={() => {
            if (!publicKey) {
              walletModal.setVisible(true);
              return;
            }

            safePromise(
              confirmTransaction(
                makeNFTBid(safePubkeyString(publicKey), mint, bid),
                'Bid Placed',
                'Bid Failed'
              )
                .then(() => resetOwnership())
                .catch(() => resetOwnership())
            );
          }}
        >
          Bid
        </Button>
      </ItemContainer>
    </ItemsContainer>
  );
}

export default TradeNFT;
