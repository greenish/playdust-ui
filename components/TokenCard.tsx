import {
  Card,
  CardContent,
  Typography,
  Skeleton,
} from '@mui/material'
import { ParsedMetadata } from '../solana/types'
import { useState } from 'react'

const imageSize = 300

interface TokenCardProps {
  metadata: ParsedMetadata
}

const TokenCard = ({ metadata }: TokenCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const {
    offchain,
    onchain,
  } = metadata
  const {
    name,
  } = onchain.data

  return (
    <Card sx={{ m: 2 }}>
      {
        offchain?.image && (
          <img
            alt={name}
            src={offchain.image}
            height={imageSize}
            style={isLoaded ? {} : {display: 'none'}}
            onLoad={() => setIsLoaded(true)}
          />
        )
      }
      {
        !isLoaded && (
          <Skeleton
            sx={{
              height: imageSize,
              width: imageSize,
            }}
            animation="wave"
            variant="rectangular"
          />
        )
      }
      <CardContent>
        <Typography>{name}</Typography>
      </CardContent>
    </Card>
  )
}

export default TokenCard