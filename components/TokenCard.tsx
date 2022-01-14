import {
  Card,
  CardContent,
  Typography,
  Skeleton,
} from '@mui/material'
import { ParsedMetadata } from '../solana/types'
import { useState } from 'react'
import { useRecoilValueLoadable } from 'recoil'
import { fetchOffchain } from '../store'

const imageSize = 300

interface TokenCardProps {
  metadata: ParsedMetadata
}

const TokenCard = ({ metadata }: TokenCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const {
    name,
    uri,
  } = metadata.onchain.data

  const { contents } = useRecoilValueLoadable(fetchOffchain(uri))

  return (
    <Card sx={{ m: 2 }}>
      {
        contents?.image && (
          <img
            alt={name}
            src={contents.image}
            height={imageSize}
            style={isLoaded ? {} : {display: 'none'}}
            onLoad={() => setIsLoaded(true)}
          />
        )
      }
      {
        (!contents || !isLoaded) && (
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