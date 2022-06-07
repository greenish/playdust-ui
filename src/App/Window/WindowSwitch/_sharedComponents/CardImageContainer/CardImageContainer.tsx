import { Box, Skeleton } from '@mui/material';
import React, { useState } from 'react';
import LazyImage from './LazyImage';

interface CardImageContainerProps {
  src?: string;
  imageSize: number;
  censored?: boolean;
}

function CardImageContainer({
  src,
  imageSize,
  censored,
}: CardImageContainerProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      {src && (
        <Box
          component="div"
          sx={{
            display: 'flex',
            justifyContent: 'center',
            maxHeight: imageSize,
          }}
        >
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
        </Box>
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
    </>
  );
}

export default CardImageContainer;
