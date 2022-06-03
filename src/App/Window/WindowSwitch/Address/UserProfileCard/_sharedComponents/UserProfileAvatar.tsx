import { Avatar, AvatarProps, Box, ButtonBase, ImageList } from '@mui/material';
import React, { useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import getCDNUrl from '../../../../../_helpers/getCDNUrl';
import CardImageContainer from '../../../_sharedComponents/CardImageContainer/CardImageContainer';
import nftsForAddressAtom from '../../_atoms/nftsForAddressAtom';

const imageSize = 100;
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

  const currentImage = useMemo(() => {
    const currentNft = nfts.find((nft) => nft.mint === value);
    return currentNft?.offChainData.image;
  }, [value, nfts]);

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
      }}
    >
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
          sx={{ width: '100%', maxHeight: imageSize * maxRows }}
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
    </Box>
  );
}

export default UserProfileAvatar;
