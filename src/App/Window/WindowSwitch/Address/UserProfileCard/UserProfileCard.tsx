import { Card } from '@mui/material';
import React from 'react';
import { useRecoilValue } from 'recoil';
import UserProfileContent from './UserProfileContent/UserProfileContent';
import UserProfileForm from './UserProfileForm';
import publicProfileAtom from './_atoms/publicProfileAtom';
import userProfileEditAtom from './_atoms/userProfileEditAtom';

function UserProfileCard() {
  const publicProfile = useRecoilValue(publicProfileAtom);
  const edit = useRecoilValue(userProfileEditAtom);

  if (!publicProfile) {
    return null;
  }

  return <Card>{!edit ? <UserProfileContent /> : <UserProfileForm />}</Card>;
}

export default UserProfileCard;
