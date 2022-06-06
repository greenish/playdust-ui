import React from 'react';
import useIsWallet from '../_hooks/useIsWallet';
import PrivateUserProfile from './PrivateUserProfile/PrivateUserProfile';
import PublicUserProfile from './PublicUserProfile';
import useIsCurrentUser from './_hooks/useIsCurrentUser';

function UserProfile() {
  const isWallet = useIsWallet();
  const isCurrentUser = useIsCurrentUser();

  if (!isWallet) {
    return null;
  }

  return isCurrentUser ? <PrivateUserProfile /> : <PublicUserProfile />;
}

export default UserProfile;
