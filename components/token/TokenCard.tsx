import styled from '@emotion/styled'
import { Card, CardContent, Skeleton, Typography } from '@mui/material'
import { useState } from 'react'
import SearchMetadata from '../../types/SearchMetadata'
import Link from '../common/Link'
import Image from '../utils/image'
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
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const CardImageContainer = styled.div`
  display: flex;
  justify-content: center;
`

interface TokenCardProps {
  metadata: SearchMetadata
}

const TokenCard = ({ metadata }: TokenCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const { offChainData, mint, data } = metadata
  const href = `nfts/${mint}`

  return (
    <div>
      <Card sx={{ mr: 2, width: dimensions.width }}>
        <Link href={href}>
          {offChainData?.image && (
            <CardImageContainer>
              <Image
                alt={offChainData.name}
                url={offChainData.image}
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
              <Link href={href}>{offChainData?.name || data?.name}</Link>
            </Typography>
            {offChainData?.attributes && (
              <TokenCardFilter metadata={metadata} />
            )}
          </CardContentContainer>
        </CardContent>
      </Card>
    </div>
  )
}

export default TokenCard
