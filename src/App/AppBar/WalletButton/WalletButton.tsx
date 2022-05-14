import { Person } from '@mui/icons-material';
import {
  Fab,
  FormControl,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useRecoilState } from 'recoil';
import solanaClustersAtom from '../../_atoms/solanaClustersAtom';
import { autoRefresh } from '../../_helpers/playdustApi';
import safePromise from '../../_helpers/safePromise';
import shortenPublicKey from './_helpers/shortenPublicKey';
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
  const [solanaClusters, setSolanaClusters] =
    useRecoilState(solanaClustersAtom);
  const [cookies, setCookie, removeCookie] = useCookies<
    string,
    { authToken: string; nonce: string }
  >(['authToken', 'nonce']);
  const goToProfile = useGoToProfile();

  const buttonProps =
    wallet.connected && wallet.publicKey
      ? {
          children: shortenPublicKey(wallet.publicKey),
          onClick: (event: React.MouseEvent<HTMLButtonElement>) =>
            setAnchorEl(event.currentTarget),
        }
      : {
          children: 'Connect Wallet',
          onClick: () => walletModal.setVisible(true),
        };

  useEffect(() => {
    if (cookies && wallet.connected) {
      const pubKey = wallet.publicKey?.toBase58();

      if (pubKey) {
        autoRefresh(pubKey, cookies.nonce, cookies.authToken, setCookie);
      }
    }
  }, [cookies, setCookie, wallet]);

  return (
    <>
      <Fab
        {...buttonProps}
        size="small"
        sx={{ width: size, height: size, backgroundColor }}
      >
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
        <Typography sx={{ p: 2 }}>
          {wallet.publicKey && shortenPublicKey(wallet.publicKey)}
        </Typography>
        <MenuItem sx={{ p: 2 }} onClick={() => goToProfile()}>
          View Profile
        </MenuItem>
        <MenuItem
          sx={{ p: 2 }}
          onClick={() => {
            safePromise(wallet.disconnect());
            removeCookie('authToken');
            setAnchorEl(null);
          }}
        >
          Disconnect
        </MenuItem>
        <MenuItem sx={{ p: 2 }}>
          <FormControl fullWidth={true}>
            <InputLabel>Network</InputLabel>
            <Select
              value={solanaClusters.selectedIndex}
              onChange={(evt) => {
                const nextIndex = evt.target.value;
                if (typeof nextIndex === 'number') {
                  setSolanaClusters((curr) => ({
                    ...curr,
                    selectedIndex: nextIndex,
                  }));
                }
              }}
            >
              {solanaClusters.clusters.map((cluster, idx) => (
                <MenuItem value={idx} key={cluster.network}>
                  {cluster.network}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </MenuItem>
      </Menu>
    </>
  );
}

export default WalletButton;
