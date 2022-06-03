import { Person } from '@mui/icons-material';
import { Fab, Menu, MenuItem } from '@mui/material';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import safePromise from '../../_helpers/safePromise';
import connectedWalletAtom from './_atoms/connectedWalletAtom';
import isLoggedInAtom from './_atoms/isLoggedInAtom';
import shortenPublicKey from './_helpers/shortenPublicKey';
import useGoToProfile from './_hooks/useGoToProfile';
import useLogout from './_hooks/useLogout';
import useSignAuthMessage from './_hooks/useSignAuthMessage';

interface WalletButtonProps {
  backgroundColor: string;
  size: number;
}

function WalletButton({ backgroundColor, size }: WalletButtonProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const walletModal = useWalletModal();
  const wallet = useWallet();
  const open = !!anchorEl;
  const logout = useLogout();
  const signAuthMessage = useSignAuthMessage();
  const goToProfile = useGoToProfile();
  const [connectedWallet, setConnectedWallet] =
    useRecoilState(connectedWalletAtom);
  const isLoggedIn = useRecoilValue(isLoggedInAtom);

  useEffect(() => {
    if (wallet.connected && wallet.publicKey) {
      const publicKeyString = wallet.publicKey.toString();

      setConnectedWallet(publicKeyString);
    }
  }, [setConnectedWallet, wallet.connected, wallet.publicKey]);

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
        {!isLoggedIn && (
          <MenuItem
            onClick={() => {
              safePromise(signAuthMessage());
            }}
          >
            Login
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            safePromise(logout());
          }}
        >
          {isLoggedIn ? 'Logout' : 'Disconnect'}
        </MenuItem>
      </Menu>
    </>
  );
}

export default WalletButton;
