import { Card } from '@mui/material';
import React from 'react';
import { useRecoilValue } from 'recoil';
import useIsCurrentUser from '../../../_hooks/useIsCurrentUser';
import useIsWallet from '../_hooks/useIsWallet';
import UserProfileContent from './UserProfileContent';
import UserProfileForm from './UserProfileForm';
import publicProfileAtom from './_atoms/publicProfileAtom';
import userProfileEditAtom from './_atoms/userProfileEditAtom';

function UserProfileCard() {
  const isWallet = useIsWallet();
  const isCurrentUser = useIsCurrentUser();
  const publicProfile = useRecoilValue(publicProfileAtom);
  const edit = useRecoilValue(userProfileEditAtom);

  if (!isWallet && !isCurrentUser && !publicProfile) {
    return null;
  }

  return <Card>{!edit ? <UserProfileContent /> : <UserProfileForm />}</Card>;
}

export default UserProfileCard;
