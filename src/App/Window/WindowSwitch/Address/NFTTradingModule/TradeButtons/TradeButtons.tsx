import { Button } from '@mui/material';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import React, { useCallback } from 'react';
import { useRecoilRefresher_UNSTABLE, useRecoilValue } from 'recoil';
import safePromise from '../../../../../_helpers/safePromise';
import safePubkeyString from '../../_helpers/safePubkeyString';
import isWalletMintOwnerAtom from '../_atoms/isWalletMintOwnerAtom';
import ordersForMintAtom from '../_atoms/ordersForMintAtom';
import tokenAccountsForWalletAtom from '../_atoms/tokenAccountsForWalletAtom';
import cancelNFTBid from './_helpers/cancelNFTBid';
import cancelNFTListing from './_helpers/cancelNFTListing';
import makeNFTBid from '../_helpers/makeNFTBid';
import makeNFTListing from '../_helpers/makeNFTListing';
import useConfirmTransaction from '../_hooks/useConfirmTransaction';

interface TradeNFTProps {
  mint: string;
  publicKey: string | null;
  setExpanded: (expanded: boolean) => void;
}

function TradeButtons({ mint, publicKey, setExpanded }: TradeNFTProps) {
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
  }, [resetOrders, resetTokenAccountsForWallet]);

  const myListing =
    orders?.asks.find((order) => order.wallet === publicKey) ?? null;
  const myBid =
    orders?.bids.find((order) => order.wallet === publicKey) ?? null;
  const highestBid =
    orders?.bids.find((order) => order.wallet !== publicKey) ?? null;
  const lowestAsk =
    orders?.asks.find((order) => order.wallet !== publicKey) ?? null;

  return (
    <>
      {/* Cancel: Bid / Listing first */}
      {myBid && (
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
                cancelNFTBid(safePubkeyString(publicKey), mint, myBid.price),
                'Cancel bid Successful',
                'Cancel bid Failed'
              ).finally(reset)
            );
          }}
        >
          {`Cancel Bid: ${myBid.price} SOL`}
        </Button>
      )}
      {myListing && (
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
                  myListing.price
                ),
                'Cancel listing Successful',
                'Cancel listing Unsuccessful'
              ).finally(reset)
            );
          }}
        >
          {`Cancel Listing: ${myListing.price} SOL`}
        </Button>
      )}
      {/* Create: New offer / listing second  */}
      {isOwner && !myListing && (
        <Button
          variant={highestBid ? 'outlined' : 'contained'}
          size="large"
          color={highestBid ? 'inherit' : 'success'}
          onClick={() => {
            setExpanded(true);
          }}
        >
          List NFT for Sale
        </Button>
      )}

      {!isOwner && !myBid && (
        <Button
          variant={lowestAsk ? 'outlined' : 'contained'}
          size="large"
          color={lowestAsk ? 'inherit' : 'success'}
          onClick={() => {
            setExpanded(true);
          }}
        >
          Make Offer
        </Button>
      )}
      {/* Trade: Accept offer / listing third  */}
      {isOwner && highestBid && (
        <Button
          variant="contained"
          size="large"
          color="success"
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
                  highestBid.price
                ),
                'Buy Successful',
                'Buy Unsuccessful'
              ).finally(reset)
            );
          }}
        >
          {`Accept Highest Offer: ${highestBid.price} SOL`}
        </Button>
      )}
      {!isOwner && lowestAsk && (
        <Button
          variant="contained"
          size="large"
          color="success"
          onClick={() => {
            if (!publicKey) {
              walletModal.setVisible(true);
              return;
            }

            safePromise(
              confirmTransaction(
                makeNFTBid(safePubkeyString(publicKey), mint, lowestAsk.price),
                'Buy Successful',
                'Buy Failed'
              ).finally(reset)
            );
          }}
        >
          {`Buy for: ${lowestAsk.price} SOL`}
        </Button>
      )}
    </>
  );
}

export default TradeButtons;
