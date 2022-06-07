import { CardContent, Typography } from '@mui/material';
import React from 'react';
import { useRecoilValue } from 'recoil';
import shortenPublicKey from '../../../../../_helpers/shortenPublicKey';
import PlaydustProfileType from '../../../../_types/PlaydustProfileType';
import addressStateAtom from '../../_atoms/addressStateAtom';
import PublicProfileType from '../_types/PublicProfileType';

interface UserProfileContentProps {
  userProfile: PublicProfileType | PlaydustProfileType | null;
}

function UserProfileContent({ userProfile }: UserProfileContentProps) {
  const addressState = useRecoilValue(addressStateAtom);

  return (
    <CardContent>
      <Typography sx={{ fontWeight: 'bold', fontSize: 20 }}>
        {userProfile?.username}
      </Typography>
      <Typography sx={{ fontSize: 14, mt: 2 }}>
        {addressState && shortenPublicKey(addressState.pubkey)}
      </Typography>
      <Typography sx={{ fontSize: 14, mt: 2 }}>{userProfile?.bio}</Typography>
    </CardContent>
  );
}

export default UserProfileContent;
