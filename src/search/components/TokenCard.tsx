import styled from '@emotion/styled'
import { Card, CardContent, Skeleton, Typography } from '@mui/material'
import { useState } from 'react'
import Link from '../../../components/common/Link'
import Image from '../../../components/utils/image'
import SearchMetadata from '../../../types/SearchMetadata'
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

const CardContentContainer = styled.div`
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const CardImageContainer = styled.div`
  display: flex;
  justify-content: center;
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
    <div>
      <Card sx={{ mr: 2, width: dimensions.width }}>
        <Link href={href}>
          {image && (
            <CardImageContainer>
              <Image
                alt={name}
                url={image}
                style={
                  isLoaded
                    ? {
                        objectFit: 'cover',
                        width: dimensions.width,
                        height: dimensions.width,
                      }
                    : { display: 'none' }
                }
                onLoad={() => setIsLoaded(true)}
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
        </Link>
        <CardContent>
          <CardContentContainer>
            <Typography>
              <Link href={href}>{name || metadata?.data?.name}</Link>
            </Typography>
            {metadata && metadata.offChainData?.attributes && (
              <TokenCardFilter metadata={metadata} />
            )}
          </CardContentContainer>
        </CardContent>
      </Card>
    </div>
  )
}

export default TokenCard
