import { keyframes } from '@emotion/react';
import { Fab, Theme } from '@mui/material';
import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react';
import getCDNUrl from '../_helpers/getCDNUrl';
import safePromise from '../_helpers/safePromise';

function usePreloadImages(images: string[] = []) {
  const [loadedImages, setLoadedImages] = useState<string[]>(
    images.slice(0, 1)
  );

  useEffect(() => {
    if (images.length) {
      const loadImages = async () => {
        const promises = images.map(
          (image) =>
            new Promise<string>((resolve) => {
              const img = new Image();

              img.src = getCDNUrl(image);
              img.onload = () => resolve(img.src);
            })
        );

        setLoadedImages(await Promise.all(promises));
      };

      safePromise(loadImages());
    }
  }, [images, setLoadedImages]);

  return loadedImages;
}

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
  const loadedImages = usePreloadImages(images);

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

      if (loadedImages.length) {
        const sliceLength = 100 / loadedImages.length;
        const keyframeInput = loadedImages
          .map((image, idx) => {
            const start = idx === 0 ? '0%,100%' : `${sliceLength * idx}%`;

            return `${start} {background-image: url("${image}");}`;
          })
          .join('');

        const animation = keyframes(keyframeInput);
        const animationTime = transitionDuration * loadedImages.length;

        return {
          ...baseStyleProps,
          backgroundSize: 'cover',
          animation: `${animation} ${animationTime}s infinite`,
        };
      }

      return baseStyleProps;
    },
    [size, transitionDuration, loadedImages]
  );

  return (
    <Fab sx={sx} disabled={!onClick} onClick={onClick}>
      {!images && children}
    </Fab>
  );
}

export default ImageButton;