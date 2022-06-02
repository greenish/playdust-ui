import { Box, Card } from '@mui/material';
import React from 'react';
import { useRecoilValue } from 'recoil';
import useConnectedWallet from '../../../../_hooks/useConnectedWallet';
import addressStateAtom from '../_atoms/addressStateAtom';
import useIsWallet from '../_hooks/useIsWallet';
import UserProfileAvatar from './UserProfileAvatar';
import UserProfileContent from './UserProfileContent';
import UserProfileForm from './UserProfileForm';

function UserProfileCard() {
  const isWallet = useIsWallet();
  const addressState = useRecoilValue(addressStateAtom);
  const publicKeyString = addressState?.pubkey.toString();
  const connectedWallet = useConnectedWallet();
  const isCurrentUser = isWallet && publicKeyString === connectedWallet;

  // TODO: return null if user is not current user and does not exist
  if (!isWallet && !isCurrentUser) {
    return null;
  }

  return (
    <Card sx={{ display: 'flex' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          m: 2,
          mr: 0,
        }}
      >
        <UserProfileAvatar />
      </Box>
      <Box sx={{ width: '100%' }}>
        <UserProfileContent />
        <UserProfileForm />
      </Box>
    </Card>
  );
}

export default UserProfileCard;
