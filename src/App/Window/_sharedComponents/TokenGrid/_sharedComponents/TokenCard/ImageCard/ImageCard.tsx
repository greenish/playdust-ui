import styled from '@emotion/styled'
import { Paper, Skeleton } from '@mui/material'
import { Box } from '@mui/system'
import { PropsWithChildren, useState } from 'react'
import { useRecoilValue } from 'recoil'
import Status from '../../../../../../_helpers/statusEnum'
import collectionStatusAtom from '../../../../../_atoms/collectionStatus'
import Link from '../../../../Link'
import TokenCardContentContainer from '../_sharedComponents/TokenCardContentContainer'
import LazyImage from './LazyImage'

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

export interface ImageCardProps {
  src?: string
  href?: string
  imageSize: number
  content: React.ReactElement
  contentHeight: number
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
  const status = useRecoilValue(collectionStatusAtom)

  return (
    <Paper sx={{ width: imageSize }} square>
      <LinkWrapper href={href} onClick={onClick}>
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
      {contentHeight !== 0 && (
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
  )
}

export default ImageCard
