import styled from '@emotion/styled'
import { Card, Skeleton } from '@mui/material'
import { Box } from '@mui/system'
import { PropsWithChildren, useState } from 'react'
import { useRecoilValue } from 'recoil'
import Link from '../../app/components/Link'
import LazyImage from '../../common/components/LazyImage'
import Status from '../../common/types/Status'
import * as store from '../store'

const CardContentContainer = styled.div`
  height: 100%;
  width: 100%;
  padding-left: 12px;
  padding-right: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const CardImageContainer = styled.div`
  display: flex;
  justify-content: center;
`

type LinkWrapperProps = PropsWithChildren<{
  href: string | undefined
  onClick?: () => any
}>

const LinkWrapper = ({ href, children, onClick }: LinkWrapperProps) => {
  if (href) {
    return <Link href={href}>{children}</Link>
  }

  if (onClick) {
    return (
      <div style={{ cursor: 'pointer' }} onClick={onClick}>
        {children}
      </div>
    )
  }

  return <>{children}</>
}

interface ImageCardProps {
  src?: string
  href?: string
  imageSize: number
  content: React.ReactElement
  contentHeight: string
  onClick?: () => any
}

const ImageCard = ({
  src,
  href,
  imageSize,
  content,
  contentHeight,
  onClick,
}: ImageCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const status = useRecoilValue(store.collectionStatus)

  return (
    <div>
      <Card sx={{ mr: 2, width: imageSize }} square>
        <LinkWrapper href={href} onClick={onClick}>
          {src && (
            <CardImageContainer>
              <LazyImage
                src={src}
                style={
                  isLoaded
                    ? {
                        objectFit: 'cover',
                        width: imageSize,
                        height: imageSize,
                        filter:
                          status === Status.Censored || status === Status.NSFW
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
        </LinkWrapper>
        <Box
          sx={{
            height: contentHeight,
            width: '100%',
          }}
        >
          <CardContentContainer>{content}</CardContentContainer>
        </Box>
      </Card>
    </div>
  )
}

export default ImageCard
