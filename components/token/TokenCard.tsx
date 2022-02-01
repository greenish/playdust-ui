import styled from '@emotion/styled'
import { Card, CardContent, Skeleton, Typography } from '@mui/material'
import { useState } from 'react'
import { ParsedMetadata } from '../../solana/types'
import Link from '../common/Link'
import TokenCardFilter from './TokenCardFilter'

const imageSize = 300
export const dimensions = {
  height: 425,
  width: 350,
}

export const TokenCardContainer = styled.div`
  height: ${dimensions.height}px;
  width: ${dimensions.width}px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
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
    <TokenCardContainer>
      <Card sx={{ width: imageSize }}>
        <Link href={href}>
          {offchain?.image && (
            <CardImageContainer>
              <img
                alt={name}
                src={offchain.image}
                height={imageSize}
                style={isLoaded ? {} : { display: 'none' }}
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
    </TokenCardContainer>
  )
}

export default TokenCard
