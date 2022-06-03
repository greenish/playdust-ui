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
  const connectedWallet = useConnectedWallet();
  const addressState = useRecoilValue(addressStateAtom);

  const publicKeyString = addressState?.pubkey.toString();
  // const isCurrentUser = publicKeyString === connectedWallet;
  const isCurrentUser = true;

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
          alignItems: 'center',
          ml: 2,
          minWidth: '215px',
          maxWidth: '215px',
        }}
      >
        <UserProfileAvatar />
      </Box>
      <Box sx={{ width: '100%' }}>
        <UserProfileContent />
        {isCurrentUser && <UserProfileForm />}
      </Box>
    </Card>
  );
}

export default UserProfileCard;
