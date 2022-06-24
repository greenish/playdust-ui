import React, { PropsWithChildren } from 'react';
import { useRecoilValue } from 'recoil';
import currentUserProfileAtom from '../../_atoms/currentUserProfileAtom';
import JoinTheWhitelist from './JoinTheWhitelist/JoinTheWhitelist';

function WhitelistGuarded({ children }: PropsWithChildren<object>) {
  const currentUserProfile = useRecoilValue(currentUserProfileAtom);

  if (
    process.env.GO_LIVE !== "true"
    && (
      !currentUserProfile 
      || (!currentUserProfile.isWhitelisted && !currentUserProfile.isAdmin)
    )
  ) {
    return <JoinTheWhitelist />;
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
}

export default WhitelistGuarded;
