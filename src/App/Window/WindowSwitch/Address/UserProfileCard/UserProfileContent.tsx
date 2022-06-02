import { Button, CardActions, CardContent, Typography } from '@mui/material';
import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import profileApi from '../../../../AppBar/WalletButton/_helpers/profileApi';
import safePromise from '../../../../_helpers/safePromise';
import useConnectedWallet from '../../../../_hooks/useConnectedWallet';
import useToken from '../../../../_hooks/useToken';
import UserProfileType from '../../../../_types/UserProfileType';
import addressStateAtom from '../_atoms/addressStateAtom';
import useIsWallet from '../_hooks/useIsWallet';
import userProfileForAddressAtom from './_atoms/userProfileForAddressAtom';
import userProfileFormAtom from './_atoms/userProfileFormAtom';

function UserProfileContent() {
  const token = useToken();
  const isWallet = useIsWallet();
  const addressState = useRecoilValue(addressStateAtom);
  const publicKeyString = addressState?.pubkey.toString();
  const connectedWallet = useConnectedWallet();
  // const isCurrentUser =
  //   isWallet &&
  //   publicKeyString === connectedWallet;
  const isCurrentUser = true;
  const userProfile = useRecoilValue(userProfileForAddressAtom);
  const [userProfileForm, setUserProfileForm] =
    useRecoilState(userProfileFormAtom);

  if (userProfileForm.edit) {
    return null;
  }

  const handleEdit = async () => {
    const authToken = await token.get();

    if (authToken) {
      try {
        const { data } = await profileApi.get<UserProfileType>('/read', {
          params: {
            walletAddress: connectedWallet,
          },
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setUserProfileForm({ edit: true, state: data });
      } catch (e) {
        console.error(e);
        setUserProfileForm({ edit: true, state: userProfile });
      }
    }
  };

  return (
    <>
      <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography sx={{ fontWeight: 'bold', fontSize: 20 }}>
          {userProfile.username}
        </Typography>
        <Typography sx={{ fontSize: 14, mt: 2 }}>{publicKeyString}</Typography>
        <Typography sx={{ fontSize: 14, mt: 2 }}>{userProfile.bio}</Typography>
      </CardContent>
      {isCurrentUser && (
        <CardActions sx={{ ml: 1 }}>
          <Button variant="contained" onClick={() => safePromise(handleEdit())}>
            Edit
          </Button>
        </CardActions>
      )}
    </>
  );
}

export default UserProfileContent;
