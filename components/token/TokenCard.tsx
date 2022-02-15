import styled from '@emotion/styled'
import { Card, CardContent, Skeleton, Typography } from '@mui/material'
import { useState } from 'react'
import { ParsedMetadata } from '../../solana/types'
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
  metadata: ParsedMetadata
}

const TokenCard = ({ metadata }: TokenCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const { offchain, onchain } = metadata
  const { name } = onchain.data
  const href = `nfts/${onchain.mint}`

  return (
    <div>
      <Card sx={{ mr: 2 }}>
        <Link href={href}>
          {offchain?.image && (
            <CardImageContainer>
              <Image
                alt={name}
                url={offchain.image}
                width={imageSize}
                height={imageSize}
                style={isLoaded ? { objectFit: 'cover' } : { display: 'none' }}
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
              <Link href={href}>{name}</Link>
            </Typography>
            {offchain.attributes && <TokenCardFilter metadata={metadata} />}
          </CardContentContainer>
        </CardContent>
      </Card>
    </div>
  )
}

export default TokenCard
