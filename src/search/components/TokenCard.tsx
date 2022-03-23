import styled from '@emotion/styled'
import { Typography } from '@mui/material'
import { useState } from 'react'
import Link from '../../../components/common/Link'
import SearchMetadata from '../../../types/SearchMetadata'
import getNFTImageUrl from '../helpers/getNFTImageUrl'
import ImageCard from './ImageCard'
import TokenCardFilter from './TokenCardFilter'

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
  metadata?: SearchMetadata
  loading: boolean
}

const TokenCard = ({ metadata }: TokenCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const { image, name } = metadata?.offChainData || {}
  const href = `nfts/${metadata?.mint}`

  return (
    <ImageCard
      imageSize={imageSize}
      src={image && getNFTImageUrl(image, imageSize, imageSize)}
      href={href}
      content={
        <>
          <Typography>
            <Link href={href}>{name || metadata?.data?.name}</Link>
          </Typography>
          {metadata && metadata.offChainData?.attributes && (
            <TokenCardFilter metadata={metadata} />
          )}
        </>
      }
      contentHeight="70px"
    />
  )
}

export default TokenCard
