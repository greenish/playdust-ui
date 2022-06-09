import { Cancel, CheckCircle } from '@mui/icons-material';
import {
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
import addressStateAtom from '../../_atoms/addressStateAtom';
import currentOwnerForMintAtom from '../../_atoms/currentOwnerForMintAtom';
import safePubkeyString from '../../_helpers/safePubkeyString';
import ExplorerLink from '../../_sharedComponents/ExplorerLink/ExplorerLink';
import ordersForMintAtom from '../_atoms/ordersForMintAtom';
import tradingDialogAtom from '../_atoms/tradingDialogAtom';

function NFTOrderBookAsks() {
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
  const myListing =
    orders?.asks.find((order) => order.wallet === connectedWallet) ?? null;

  const filteredAsks = (orders?.asks ?? []).filter(
    (order) => order.wallet === ownerWalletAddress
  );

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <b>Ask</b>
            </TableCell>
            <TableCell>From</TableCell>
            <TableCell>Tx</TableCell>
            <TableCell>
              <b>{filteredAsks.length > 0 && !isOwner ? 'Buy' : ''}</b>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredAsks.length <= 0 && (
            <TableRow sx={{ textAlign: 'left', padding: '16px' }}>
              <TableCell>
                <b>No active asks found!</b>
              </TableCell>
            </TableRow>
          )}
          {filteredAsks.length > 0 &&
            filteredAsks.map((order) => (
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
                  {myListing?.txHash === order.txHash && (
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => {
                        if (!connectedWallet) {
                          walletModal.setVisible(true);
                          return;
                        }
                        setTradingDialog({
                          type: 'cancelAsk',
                          wallet: connectedWallet,
                          ask: order,
                          mintAddress,
                        });
                      }}
                    >
                      <Cancel />
                    </IconButton>
                  )}
                  {!myListing && (
                    <IconButton
                      size="small"
                      color="success"
                      onClick={() => {
                        if (!connectedWallet) {
                          walletModal.setVisible(true);
                          return;
                        }
                        setTradingDialog({
                          type: 'acceptAsk',
                          wallet: connectedWallet,
                          ask: order,
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

export default NFTOrderBookAsks;
