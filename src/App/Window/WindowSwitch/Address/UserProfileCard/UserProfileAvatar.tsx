import { Avatar, AvatarProps, ButtonBase, ImageList } from '@mui/material';
import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import getCDNUrl from '../../../../_helpers/getCDNUrl';
import CardImageContainer from '../../_sharedComponents/TokenCard/ImageCard/CardImageContainer';
import nftsForAddressAtom from '../WalletGallery/_atoms/nftsForAddressAtom';
import userProfileAtom from './_atoms/userProfileAtom';
import userProfileFormAtom from './_atoms/userProfileFormAtom';

const imageSize = 100;

function UserProfileAvatar(props: AvatarProps) {
  const [userProfile, setUserProfile] = useRecoilState(userProfileAtom);
  const [userProfileForm, setUserProfileForm] =
    useRecoilState(userProfileFormAtom);
  const nfts = useRecoilValue(nftsForAddressAtom).filter(
    (nft) => nft.offChainData
  );

  const mintAddress = userProfile.profilePictureMintAddress;

  const currentNft = nfts.find((nft) => nft.mint === mintAddress);
  const currentImage = currentNft?.offChainData.image;
  const canEdit = userProfileForm.edit && !!nfts.length;

  const toggleEditor = () =>
    canEdit &&
    setUserProfileForm((prev) => ({ ...prev, editPicture: !prev.editPicture }));

  return !userProfileForm.editPicture ? (
    <Avatar
      {...props}
      sx={{
        width: imageSize * 1.5,
        height: imageSize * 1.5,
        cursor: canEdit ? 'pointer' : 'default',
        ...props.sx,
      }}
      src={currentImage && getCDNUrl(currentImage)}
      onClick={() => canEdit && toggleEditor()}
    />
  ) : (
    <ImageList
      sx={{ width: '100%', height: imageSize * 5 }}
      gap={0}
      cols={2}
      rowHeight={imageSize}
    >
      {nfts.map((nft) => {
        const { image } = nft?.offChainData || {};

        return (
          <ButtonBase
            key={nft.mint}
            onClick={() => {
              setUserProfile((prev) => ({
                ...prev,
                profilePictureMintAddress: nft.mint,
              }));
              toggleEditor();
            }}
          >
            <CardImageContainer
              imageSize={imageSize}
              src={image && getCDNUrl(image)}
            />
          </ButtonBase>
        );
      })}
    </ImageList>
  );
}

export default UserProfileAvatar;
