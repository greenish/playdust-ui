import {
  Box,
  Button,
  CardActions,
  CardContent,
  Typography,
} from '@mui/material';
import React from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import safePromise from '../../../../../_helpers/safePromise';
import shortenPublicKey from '../../../../../_helpers/shortenPublicKey';
import useAuth from '../../../../../_hooks/useAuth';
import useConnectedWallet from '../../../../../_hooks/useConnectedWallet';
import useProfileState from '../../../../_hooks/useProfileState';
import PlaydustProfileType from '../../../../_types/PlaydustProfileType';
import addressStateAtom from '../../_atoms/addressStateAtom';
import publicProfileAtom from '../_atoms/publicProfileAtom';
import userProfileEditAtom from '../_atoms/userProfileEditAtom';
import profileApi from '../_helpers/profileApi';
import UserProfileAvatar from '../_sharedComponents/UserProfileAvatar';
import useIsCurrentUser from './_hooks/useIsCurrentUser';

function UserProfileContent() {
  const auth = useAuth();
  const isCurrentUser = useIsCurrentUser();
  const connectedWallet = useConnectedWallet();
  const addressState = useRecoilValue(addressStateAtom);
  const setEdit = useSetRecoilState(userProfileEditAtom);
  const publicProfile = useRecoilValue(publicProfileAtom);
  const [userProfile, setUserProfile] = useProfileState();

  const handleEdit = async () => {
    const tokens = await auth.getTokens();

    if (tokens && !userProfile) {
      const { data } = await profileApi.get<PlaydustProfileType>('/read', {
        params: {
          walletAddress: connectedWallet,
        },
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      });
      setUserProfile(data);
    }

    setEdit(true);
  };

  const profile = userProfile || publicProfile;

  return (
    <Box sx={{ display: 'flex' }}>
      <UserProfileAvatar value={profile?.profilePictureMintAddress} />
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Typography sx={{ fontWeight: 'bold', fontSize: 20 }}>
          {profile?.username}
        </Typography>
        <Typography sx={{ fontSize: 14, mt: 2 }}>
          {addressState && shortenPublicKey(addressState.pubkey)}
        </Typography>
        <Typography sx={{ fontSize: 14, mt: 2 }}>{profile?.bio}</Typography>
        {isCurrentUser && (
          <CardActions sx={{ p: 0, mt: 2 }}>
            <Button
              variant="contained"
              onClick={() => safePromise(handleEdit())}
            >
              Edit
            </Button>
          </CardActions>
        )}
      </CardContent>
    </Box>
  );
}

export default UserProfileContent;
