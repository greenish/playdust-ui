import styled from '@emotion/styled';
import { Avatar, AvatarProps, ButtonBase, ImageList } from '@mui/material';
import React, { useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import getCDNUrl from '../../../../_helpers/getCDNUrl';
import CardImageContainer from '../../_sharedComponents/TokenCard/ImageCard/CardImageContainer';
import nftsForAddressAtom from '../WalletGallery/_atoms/nftsForAddressAtom';

const imageSize = 100;

const AvatarContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-left: 16px;
  min-width: 215px;
  max-width: 215px;
`;

interface UserProfileAvatarProps extends Omit<AvatarProps, 'onChange'> {
  value?: string;
  onChange?: (value: string) => void;
}

function UserProfileAvatar({
  value = '',
  onChange,
  ...avatarProps
}: UserProfileAvatarProps) {
  const [edit, setEdit] = useState(false);
  const nfts = useRecoilValue(nftsForAddressAtom).filter(
    (nft) => nft.offChainData
  );

  const currentImage = useMemo(() => {
    const currentNft = nfts.find((nft) => nft.mint === value);
    return currentNft?.offChainData.image;
  }, [value, nfts]);

  const disabled = !onChange || !nfts.length;

  return (
    <AvatarContainer>
      {!edit ?? disabled ? (
        <Avatar
          {...avatarProps}
          sx={{
            width: imageSize * 1.5,
            height: imageSize * 1.5,
            cursor: !disabled ? 'pointer' : 'default',
            ...avatarProps.sx,
          }}
          src={currentImage && getCDNUrl(currentImage)}
          onClick={() => !disabled && setEdit(true)}
        />
      ) : (
        <ImageList
          sx={{ width: '100%', height: imageSize * 5 }}
          gap={0}
          cols={2}
          rowHeight={imageSize}
        >
          {nfts.map(({ mint, offChainData: { image } }) => (
            <ButtonBase
              key={mint}
              onClick={() => {
                onChange?.(mint);
                setEdit(false);
              }}
            >
              <CardImageContainer
                imageSize={imageSize}
                src={image && getCDNUrl(image)}
              />
            </ButtonBase>
          ))}
        </ImageList>
      )}
    </AvatarContainer>
  );
}

export default UserProfileAvatar;
