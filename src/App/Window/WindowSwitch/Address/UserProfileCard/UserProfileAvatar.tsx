import { Avatar, AvatarProps, ButtonBase, ImageList } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import getCDNUrl from '../../../../_helpers/getCDNUrl';
import CardImageContainer from '../../_sharedComponents/TokenCard/ImageCard/CardImageContainer';
import nftsForAddressAtom from '../WalletGallery/_atoms/nftsForAddressAtom';
import userProfileForAddressAtom from './_atoms/userProfileForAddressAtom';
import userProfileFormAtom from './_atoms/userProfileFormAtom';

const imageSize = 150;

function UserProfileAvatar(props: AvatarProps) {
  const userProfile = useRecoilValue(userProfileForAddressAtom);
  const [userProfileForm, setUserProfileForm] =
    useRecoilState(userProfileFormAtom);
  const [showImageList, setShowImageList] = useState(false);
  const nfts = useRecoilValue(nftsForAddressAtom).filter(
    (nft) => nft.offChainData
  );

  const mintAddress =
    userProfileForm.state.profilePictureMintAddress ??
    userProfile.profilePictureMintAddress;

  const currentNft = nfts.find((nft) => nft.mint === mintAddress);
  const currentImage = currentNft?.offChainData.image;
  const canEdit = userProfileForm.edit && !!nfts.length;

  useEffect(() => {
    if (!canEdit) {
      setShowImageList(false);
    }
  }, [canEdit]);

  return !showImageList ? (
    <Avatar
      {...props}
      sx={{
        width: imageSize,
        height: imageSize,
        cursor: canEdit ? 'pointer' : 'default',
        ...props.sx,
      }}
      src={currentImage && getCDNUrl(currentImage)}
      onClick={() => canEdit && setShowImageList(true)}
    />
  ) : (
    <ImageList
      sx={{ width: '100%', height: imageSize * 3 }}
      gap={0}
      cols={1}
      rowHeight={imageSize}
    >
      {nfts.map((nft) => {
        const { image } = nft?.offChainData || {};

        return (
          <ButtonBase
            key={nft.mint}
            onClick={() => {
              setUserProfileForm((prev) => ({
                ...prev,
                state: {
                  ...prev.state,
                  profilePictureMintAddress: nft.mint,
                },
              }));
              setShowImageList(false);
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
