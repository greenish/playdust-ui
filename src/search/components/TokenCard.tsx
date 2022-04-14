import styled from '@emotion/styled'
import { Typography } from '@mui/material'
import Link from '../../app/components/Link'
import { encodeWindowHash } from '../../app/helpers/getWindowUrl'
import getNFTImageUrl from '../helpers/getNFTImageUrl'
import { NFTSource } from '../types/OpenSearchIndex'
import ImageCard from './ImageCard'
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

export const dimensions = {
  height: 350,
  width: 250,
  marginRight: 16,
}
const imageSize = dimensions.width

export const TokenCardPlaceholder = styled.div`
  width: ${dimensions.width + dimensions.marginRight}px;
  height: ${dimensions.height}px;
`

interface TokenCardProps {
  metadata?: NFTSource
  loading: boolean
}

const TokenCard = ({ metadata }: TokenCardProps) => {
  const { image, name } = metadata?.offChainData || {}
  const href = encodeWindowHash({
    type: 'account',
    state: metadata?.mint || '',
  })
  const { lastListPrice, listed } = metadata || {}

  return (
    <ImageCard
      imageSize={imageSize}
      src={image && getNFTImageUrl(image, imageSize, imageSize)}
      href={href}
      content={
        <CardContentContainer>
          <CardTextContainer>
            <CardText>
              <Link href={href}>{name || metadata?.data?.name}</Link>
            </CardText>
            {listed && lastListPrice && (
              <CardText sx={{ fontSize: '90%' }}>{lastListPrice} SOL</CardText>
            )}
          </CardTextContainer>
          <TokenCardFilterContainer>
            {metadata && metadata.offChainData?.attributes && (
              <TokenCardFilter metadata={metadata} />
            )}
          </TokenCardFilterContainer>
        </CardContentContainer>
      }
      contentHeight="80px"
    />
  )
}

export default TokenCard
