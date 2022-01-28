import { Card, CardContent, Typography, Skeleton } from '@mui/material'
import { ParsedMetadata } from '../../solana/types'
import { useState } from 'react'
import TokenCardFilter from './TokenCardFilter'
import styled from '@emotion/styled'
import Link from 'next/link'

const imageSize = 300
export const dimensions = {
  height: 450,
  width: 350,
}

export const TokenCardContainer = styled.div`
  height: ${dimensions.height}px;
  width: ${dimensions.width}px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const CardContentContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

interface TokenCardProps {
  metadata: ParsedMetadata
}

const TokenCard = ({ metadata }: TokenCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const { offchain, onchain } = metadata
  const { name } = onchain.data

  return (
    <TokenCardContainer>
      <Card sx={{ width: imageSize }}>
        <Link href={`nfts/${onchain.mint}`}>
          <a>
            {offchain?.image && (
              <img
                alt={name}
                src={offchain.image}
                height={imageSize}
                style={isLoaded ? {} : { display: 'none' }}
                onLoad={() => setIsLoaded(true)}
              />
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
          </a>
        </Link>
        <CardContent>
          <CardContentContainer>
            <Typography>{name}</Typography>
            {offchain.attributes && <TokenCardFilter metadata={metadata} />}
          </CardContentContainer>
        </CardContent>
      </Card>
    </TokenCardContainer>
  )
}

export default TokenCard
