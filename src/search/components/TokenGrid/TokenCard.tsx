import styled from '@emotion/styled'
import { Typography } from '@mui/material'
import Link from '../../../app/components/Link'
import { encodeWindowHash } from '../../../app/helpers/getWindowUrl'
import { NFTSource } from '../../types/OpenSearchIndex'
import ImageCard, { SkeletonImageCard } from './ImageCard'
import TokenCardFilter from './TokenCardFilter'

const CardContentContainer = styled.div`
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
`

const CardTextContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
  justify-content: center;
`

const CardText = styled(Typography)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const TokenCardFilterContainer = styled.div`
  margin-left: 8px;
`

const cdnImageSize = 250

interface TokenCardProps {
  imageSize: number
  contentHeight: number
  skeleton?: boolean
  metadata?: NFTSource
  loading?: boolean
}

const TokenCard = ({
  imageSize,
  contentHeight,
  metadata,
  skeleton,
}: TokenCardProps) => {
  const { image, name } = metadata?.offChainData || {}
  const href = encodeWindowHash({
    type: 'account',
    state: metadata?.mint || '',
  })
  const { lastListPrice, listed } = metadata || {}

  if (skeleton) {
    return (
      <SkeletonImageCard imageSize={imageSize} contentHeight={contentHeight} />
    )
  }

  return (
    <ImageCard
      imageSize={imageSize}
      src={image && `/cdn/?url=${image}&d=${cdnImageSize}x${cdnImageSize}`}
      href={href}
      content={
        contentHeight === 0 ? (
          <></>
        ) : (
          <CardContentContainer>
            <CardTextContainer>
              <CardText>
                <Link href={href}>{name || metadata?.data?.name}</Link>
              </CardText>
              {listed && lastListPrice && (
                <CardText sx={{ fontSize: '90%' }}>
                  {lastListPrice} SOL
                </CardText>
              )}
            </CardTextContainer>
            <TokenCardFilterContainer>
              {metadata && metadata.offChainData?.attributes && (
                <TokenCardFilter metadata={metadata} />
              )}
            </TokenCardFilterContainer>
          </CardContentContainer>
        )
      }
      contentHeight={contentHeight}
    />
  )
}

export default TokenCard
