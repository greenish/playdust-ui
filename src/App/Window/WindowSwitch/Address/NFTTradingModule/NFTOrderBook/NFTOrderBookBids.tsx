import { Cancel, CheckCircle } from '@mui/icons-material';
import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import React from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import connectedWalletAtom from '../../../../../_atoms/connectedWalletAtom';
import safePubkeyString from '../../../_helpers/safePubkeyString';
import ExplorerLink from '../../../_sharedComponents/ExplorerLink/ExplorerLink';
import addressStateAtom from '../../_atoms/addressStateAtom';
import currentOwnerForMintAtom from '../../_atoms/currentOwnerForMintAtom';
import ordersForMintAtom from '../_atoms/ordersForMintAtom';
import tradingDialogAtom from '../_atoms/tradingDialogAtom';

function NFTOrderBookBids() {
  const setTradingDialog = useSetRecoilState(tradingDialogAtom);
  const ownerWalletAddress = useRecoilValue(currentOwnerForMintAtom);
  const orders = useRecoilValue(ordersForMintAtom);
  const walletModal = useWalletModal();
  const addressState = useRecoilValue(addressStateAtom);
  const connectedWallet = useRecoilValue(connectedWalletAtom);
  const isOwner =
    connectedWallet !== null && ownerWalletAddress === connectedWallet;

  if (!addressState) {
    return null;
  }

  const mintAddress = safePubkeyString(addressState.pubkey);
  const myBid =
    orders?.bids.find((order) => order.wallet === connectedWallet) ?? null;

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <b>Bid</b>
            </TableCell>
            <TableCell>From</TableCell>
            <TableCell>Tx</TableCell>
            <TableCell>
              <b>
                {orders?.bids && orders.bids.length > 0 && isOwner
                  ? 'Sell'
                  : ''}
              </b>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {!orders?.bids ||
            (orders.bids.length <= 0 && (
              <Box sx={{ textAlign: 'left', padding: '16px' }}>
                <b>No active bids found!</b>
              </Box>
            ))}
          {orders?.bids &&
            orders.bids.length > 0 &&
            (orders?.bids ?? []).map((order) => (
              <TableRow
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                key={order.txHash}
              >
                <TableCell>{`◎ ${order.price}`}</TableCell>
                <TableCell>
                  <ExplorerLink
                    type="address"
                    to={order.wallet}
                    allowCopy={true}
                    ellipsis={{
                      cutoff: 4,
                      remain: 4,
                    }}
                  />
                </TableCell>
                <TableCell>
                  <ExplorerLink
                    type="tx"
                    to={order.txHash}
                    allowCopy={true}
                    ellipsis={{
                      cutoff: 4,
                      remain: 4,
                    }}
                  />
                </TableCell>
                <TableCell>
                  {myBid?.txHash === order.txHash && (
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => {
                        if (!connectedWallet) {
                          walletModal.setVisible(true);
                          return;
                        }
                        setTradingDialog({
                          type: 'cancelBid',
                          wallet: connectedWallet,
                          bid: order,
                          mintAddress,
                        });
                      }}
                    >
                      <Cancel />
                    </IconButton>
                  )}
                  {isOwner && myBid?.wallet !== connectedWallet && (
                    <IconButton
                      size="small"
                      color="success"
                      onClick={() => {
                        if (!connectedWallet) {
                          walletModal.setVisible(true);
                          return;
                        }
                        setTradingDialog({
                          type: 'acceptBid',
                          wallet: connectedWallet,
                          bid: order,
                          mintAddress,
                        });
                      }}
                    >
                      <CheckCircle />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default NFTOrderBookBids;
