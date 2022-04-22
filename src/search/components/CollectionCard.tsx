import { Typography } from '@mui/material'
import humanizeCollection from '../helpers/humanizeCollection'
import type { CollectionSource } from '../types/OpenSearchIndex'
import ImageCard from './TokenGrid/ImageCard'

interface CollectionCardProps extends CollectionSource {
  cardSize: number
  onClick?: (id: string) => any
}

const CollectionCard = ({
  id,
  cardSize,
  name,
  symbol,
  onClick,
}: CollectionCardProps) => {
  return (
    <ImageCard
      imageSize={cardSize}
      src={`/api/collection-image?id=${id}&s=${cardSize}`}
      content={
        <Typography sx={{ fontSize: 12 }}>
          {humanizeCollection({ name, symbol })}
        </Typography>
      }
      onClick={onClick ? () => onClick(id) : undefined}
      contentHeight={40}
    />
  )
}

export default CollectionCard
