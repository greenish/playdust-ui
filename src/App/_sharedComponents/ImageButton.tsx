import { keyframes } from '@emotion/react';
import { Fab, Theme } from '@mui/material';
import React, { PropsWithChildren, useCallback } from 'react';
import getCDNUrl from '../_helpers/getCDNUrl';

type SizedButtonProps = PropsWithChildren<{
  size?: number;
  transitionDuration?: number;
  images?: string[];
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}>;

function ImageButton({
  size = 40,
  transitionDuration = 2,
  images,
  onClick,
  children,
}: SizedButtonProps) {
  const sx = useCallback(
    (theme: Theme) => {
      const baseStyleProps = {
        maxWidth: size,
        minWidth: size,
        maxHeight: size,
        minHeight: size,
        boxShadow: '0px 0px 2px 0px #fefefe',
        zIndex: 2,
        backgroundColor: theme.palette.background.default,

        '&:hover': {
          backgroundColor: theme.palette.grey['200'],
        },
      };

      if (images) {
        const sliceLength = 100 / images.length;
        const keyframeInput = images
          .map((image, idx) => {
            const start = idx === 0 ? '0%,100%' : `${sliceLength * idx}%`;

            return `${start} {background-image: url("${getCDNUrl(image)}");}`;
          })
          .join('');

        const animation = keyframes(keyframeInput);
        const animationTime = transitionDuration * images.length;

        return {
          ...baseStyleProps,
          backgroundSize: 'cover',
          animation: `${animation} ${animationTime}s infinite`,
        };
      }

      return baseStyleProps;
    },
    [size, transitionDuration, images]
  );

  return (
    <Fab sx={sx} disabled={!onClick} onClick={onClick}>
      {!images && children}
    </Fab>
  );
}

export default ImageButton;
