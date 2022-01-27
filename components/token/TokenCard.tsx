import { Card, CardContent, Typography, Skeleton } from '@mui/material'
import { ParsedMetadata } from '../../solana/types'
import { useState } from 'react'
import QuickFilter from '../collection/QuickFilter'
import styled from '@emotion/styled'
import Link from 'next/link'

const CardContentContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const imageSize = 300

interface TokenCardProps {
  metadata: ParsedMetadata
}

const TokenCard = ({ metadata }: TokenCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const { offchain, onchain } = metadata
  const { name } = onchain.data

  return (
    <Link href={`nfts/${onchain.mint}`}>
      <a>
        <Card sx={{ m: 2 }}>
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
          <CardContent>
            <CardContentContainer>
              <Typography>{name}</Typography>
              <QuickFilter metadata={metadata} />
            </CardContentContainer>
          </CardContent>
        </Card>
      </a>
    </Link>
  )
}

export default TokenCard
