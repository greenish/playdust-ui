import { Box, Skeleton } from '@mui/material';
import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';

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
  const [ref, inView] = useInView({
    triggerOnce: true,
    rootMargin: '300px 0px',
  });

  return (
    <div ref={ref} data-inview={inView} style={{ overflow: 'hidden' }}>
      {src ? (
        <Box
          component="div"
          sx={{
            position: 'relative',
            maxHeight: imageSize,
            width: imageSize,
            height: imageSize,
            minHeight: imageSize,
          }}
        >
          {inView ? (
            <img // eslint-disable-line @next/next/no-img-element
              src={src}
              style={{
                position: 'absolute',
                objectFit: 'cover',
                width: imageSize,
                height: imageSize,
                filter: censored ? 'blur(1.5rem)' : 'none',
                opacity: isLoaded ? 1 : 0,
                transition: 'all .2s ease',
              }}
              alt=""
              width={imageSize}
              height={imageSize}
              onLoad={() => setIsLoaded(true)}
            />
          ) : null}
          <Skeleton
            sx={{
              position: 'absolute',
              height: imageSize,
              width: imageSize,
              opacity: isLoaded ? 0 : 1,
              transition: 'all .5s ease',
            }}
            animation="wave"
            variant="rectangular"
          />
        </Box>
      ) : (
        <Skeleton
          sx={{
            height: imageSize,
            width: imageSize,
          }}
          animation="wave"
          variant="rectangular"
        />
      )}
    </div>
  );
}

export default CardImageContainer;
