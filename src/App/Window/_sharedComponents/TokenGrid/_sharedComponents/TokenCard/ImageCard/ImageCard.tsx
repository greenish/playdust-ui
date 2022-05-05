import styled from '@emotion/styled';
import { Box, Paper, Skeleton } from '@mui/material';
import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import StatusEnum from '../../../../../../_types/StatusEnumType';
import collectionStatusAtom from '../../../../../_atoms/collectionStatus';
import Link from '../../../../Link';
import TokenCardContentContainer from '../_sharedComponents/TokenCardContentContainer';
import LazyImage from './LazyImage';

const CardImageContainer = styled.div`
  display: flex;
  justify-content: center;
`;

export interface ImageCardProps {
  src?: string;
  href: string;
  imageSize: number;
  content: JSX.Element | null;
  contentHeight: number;
}

function ImageCard({
  src,
  href,
  imageSize,
  content,
  contentHeight,
}: ImageCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const status = useRecoilValue(collectionStatusAtom);

  return (
    <Paper sx={{ width: imageSize }} square={true}>
      <Link href={href}>
        {src && (
          <CardImageContainer style={{ maxHeight: imageSize }}>
            <LazyImage
              src={src}
              style={
                isLoaded
                  ? {
                      objectFit: 'cover',
                      width: imageSize,
                      height: imageSize,
                      filter:
                        status === StatusEnum.Censored ||
                        status === StatusEnum.NSFW
                          ? 'blur(1.5rem)'
                          : 'none',
                    }
                  : { display: 'none' }
              }
              width={imageSize}
              height={imageSize}
              onLoad={() => setIsLoaded(true)}
              alt=""
            />
          </CardImageContainer>
        )}
        {!isLoaded && (
          <Skeleton
            sx={{
              height: imageSize,
              width: imageSize,
            }}
            animation="wave"
            variant="rectangular"
          />
        )}
      </Link>
      {content && (
        <Box
          sx={{
            maxHeight: contentHeight,
            height: contentHeight,
            width: '100%',
            fontSize: '80%',
          }}
        >
          <TokenCardContentContainer>{content}</TokenCardContentContainer>
        </Box>
      )}
    </Paper>
  );
}

export default ImageCard;
