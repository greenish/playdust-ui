import styled from '@emotion/styled';
import { Box, Card, Skeleton } from '@mui/material';
import React, { useState } from 'react';
import Link from '../../_sharedComponents/Link';
import TokenCardContentContainer from '../_sharedComponents/TokenCardContentContainer';
import LazyImage from './LazyImage';

const CardImageContainer = styled.div`
  display: flex;
  justify-content: center;
`;

interface ImageCardProps {
  src?: string;
  href: string;
  imageSize: number;
  content: JSX.Element | null;
  contentHeight: number;
  censored?: boolean;
}

function ImageCard({
  src,
  href,
  imageSize,
  content,
  contentHeight,
  censored,
}: ImageCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <Card sx={{ minWidth: imageSize, maxWidth: imageSize }}>
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
                      filter: censored ? 'blur(1.5rem)' : 'none',
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
    </Card>
  );
}

export default ImageCard;
