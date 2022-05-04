import styled from '@emotion/styled'
import { Typography } from '@mui/material'
import OpenSearchNFTSourceType from '../../../../../../_types/OpenSearchNFTSourceType'
import encodeWindowHash from '../../../../../_helpers/encodeWindowHash'
import getCDNUrl from '../../../../../_helpers/getCDNUrl'
import Link from '../../../Link'
import ImageCard from './ImageCard/ImageCard'
import SkeletonImageCard from './SkeletonImageCard'
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

interface TokenCardProps {
  imageSize: number
  contentHeight: number
  skeleton?: boolean
  metadata?: OpenSearchNFTSourceType
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
      src={image && getCDNUrl(image)}
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
