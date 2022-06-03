import { Person } from '@mui/icons-material';
import { Fab, Menu, MenuItem } from '@mui/material';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import React, { useState } from 'react';
import useAuth from '../../_hooks/useAuth';
import useConnectedWallet from '../../_hooks/useConnectedWallet';
import safePromise from '../../_helpers/safePromise';
import shortenPublicKey from '../../_helpers/shortenPublicKey';
import useGoToProfile from './_hooks/useGoToProfile';

interface WalletButtonProps {
  backgroundColor: string;
  size: number;
}

function WalletButton({ backgroundColor, size }: WalletButtonProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const walletModal = useWalletModal();
  const wallet = useWallet();
  const open = !!anchorEl;
  const auth = useAuth();
  const goToProfile = useGoToProfile();
  const connectedWallet = useConnectedWallet();

  const buttonProps = connectedWallet
    ? {
        children: shortenPublicKey(connectedWallet),
        onClick: (event: React.MouseEvent<HTMLButtonElement>) =>
          setAnchorEl(event.currentTarget),
      }
    : {
        children: 'Connect Wallet',
        onClick: () => walletModal.setVisible(true),
      };

  return (
    <>
      <Fab {...buttonProps} sx={{ width: size, height: size, backgroundColor }}>
        <Person />
      </Fab>
      <Menu
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        onClick={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        sx={{ ml: 2 }}
      >
        <MenuItem onClick={() => goToProfile()}>
          Wallet: {wallet.publicKey && shortenPublicKey(wallet.publicKey)}
        </MenuItem>
        <MenuItem onClick={() => safePromise(auth.logout())}>
          Disconnect
        </MenuItem>
      </Menu>
    </>
  );
}

export default WalletButton;
