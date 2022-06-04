import { Avatar, AvatarProps, Box, ButtonBase, ImageList } from '@mui/material';
import React, { useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import getCDNUrl from '../../../../../_helpers/getCDNUrl';
import setWindowImagesAtom from '../../../../_atoms/setWindowImagesAtom';
import CardImageContainer from '../../../_sharedComponents/CardImageContainer/CardImageContainer';
import nftsForAddressAtom from '../../_atoms/nftsForAddressAtom';

const imageSize = 100;
const columns = 2;
const maxRows = 4;

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
  const setWindowImages = useRecoilValue(setWindowImagesAtom);

  const currentImage = useMemo(() => {
    if (!value || !nfts.length) {
      return;
    }

    const currentNft = nfts.find((nft) => nft.mint === value);
    const image = currentNft?.offChainData.image;

    if (setWindowImages) {
      setWindowImages(image ? [image] : []);
    }

    return image;
  }, [value, nfts, setWindowImages]);

  const disabled = !onChange || !nfts.length;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 215,
        maxWidth: 215,
        p: 2,
        pr: 0,
      }}
    >
      {!edit ?? disabled ? (
        <Avatar
          {...avatarProps}
          sx={{
            width: 150,
            height: 150,
            cursor: !disabled ? 'pointer' : 'default',
            ...avatarProps.sx,
          }}
          src={currentImage && getCDNUrl(currentImage)}
          onClick={() => !disabled && setEdit(true)}
        />
      ) : (
        <ImageList
          sx={{
            width: '100%',
            maxHeight: imageSize * maxRows,
            overflow: 'hidden',
          }}
          gap={0}
          cols={columns}
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
    </Box>
  );
}

export default UserProfileAvatar;
