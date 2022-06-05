import styled from '@emotion/styled';
import { Button, InputAdornment, TextField } from '@mui/material';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import React, { useCallback, useState } from 'react';
import { useRecoilRefresher_UNSTABLE, useRecoilValue } from 'recoil';
import safePromise from '../../../../_helpers/safePromise';
import safePubkeyString from '../_helpers/safePubkeyString';
import isWalletMintOwnerAtom from './_atoms/isWalletMintOwnerAtom';
import ordersForMintAtom from './_atoms/ordersForMintAtom';
import tokenAccountsForWalletAtom from './_atoms/tokenAccountsForWalletAtom';
import makeNFTBid from './_helpers/makeNFTBid';
import makeNFTListing from './_helpers/makeNFTListing';
import useConfirmTransaction from './_hooks/useConfirmTransaction';

interface CreateOfferListingProps {
  mint: string;
  publicKey: string | null;
  setExpanded: (expanded: boolean) => void;
}

const TextFieldContainer = styled(TextField)`
  margin: 8px;
  width: 25ch;
`;

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

function CreateOfferListing({
  mint,
  publicKey,
  setExpanded,
}: CreateOfferListingProps) {
  const isOwner = useRecoilValue(isWalletMintOwnerAtom);
  const orders = useRecoilValue(ordersForMintAtom);
  const walletModal = useWalletModal();
  const confirmTransaction = useConfirmTransaction();

  const resetOrders = useRecoilRefresher_UNSTABLE(ordersForMintAtom);
  const resetTokenAccountsForWallet = useRecoilRefresher_UNSTABLE(
    tokenAccountsForWalletAtom
  );
  const reset = useCallback(() => {
    resetOrders();
    resetTokenAccountsForWallet();
    setExpanded(false);
  }, [resetOrders, resetTokenAccountsForWallet, setExpanded]);

  const [userPrice, setUserPrice] = useState(0);

  const myListing =
    orders?.asks.find((order) => order.wallet === publicKey) ?? null;
  const myBid =
    orders?.bids.find((order) => order.wallet === publicKey) ?? null;

  return (
    <div>
      {((isOwner && !myListing) || (!isOwner && !myBid)) && (
        <TextFieldContainer
          label="Price"
          value={userPrice}
          onChange={(e) => setUserPrice(Number(e.target.value))}
          {...solanaInputProps}
        />
      )}
      {isOwner && !myListing && (
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
                makeNFTListing(safePubkeyString(publicKey), mint, userPrice),
                'Listing Successful',
                'Listing Failed'
              ).finally(reset)
            );
          }}
        >
          List NFT
        </Button>
      )}

      {!isOwner && !myBid && (
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
                makeNFTBid(safePubkeyString(publicKey), mint, userPrice),
                'Offer Successful',
                'Offer Failed'
              ).finally(reset)
            );
          }}
        >
          Submit Offer
        </Button>
      )}
    </div>
  );
}

export default CreateOfferListing;
