import React, { PropsWithChildren, ReactNode } from 'react';
import { useRecoilValue } from 'recoil';
import currentUserProfileAtom from '../_atoms/currentUserProfileAtom';

function WhitelistGuarded({
  fallback,
  children,
}: PropsWithChildren<{ fallback: NonNullable<ReactNode> | null }>) {
  const currentUserProfile = useRecoilValue(currentUserProfileAtom);

  // When GO_LIVE is set to true we don't enforce whitelist so everyone has access.
  // Setting GO_LIVE to true is also useful for local development.
  const enforceWhitelist = process.env.GO_LIVE !== 'true';

  if (enforceWhitelist) {
    const userIsWhitelisted =
      currentUserProfile &&
      (currentUserProfile.isWhitelisted || currentUserProfile.isAdmin);

    if (!userIsWhitelisted) {
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return <>{fallback}</>;
    }
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
}

export default WhitelistGuarded;
