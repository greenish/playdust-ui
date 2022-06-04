import React from 'react';
import { useRecoilValue } from 'recoil';
import UserProfileEdit from './UserProfileEdit';
import UserProfileView from './UserProfileView/UserProfileView';
import publicProfileAtom from './_atoms/publicProfileAtom';
import userProfileEditAtom from './_atoms/userProfileEditAtom';

function UserProfile() {
  const publicProfile = useRecoilValue(publicProfileAtom);
  const edit = useRecoilValue(userProfileEditAtom);

  if (!publicProfile) {
    return null;
  }

  return !edit ? <UserProfileView /> : <UserProfileEdit />;
}

export default UserProfile;
