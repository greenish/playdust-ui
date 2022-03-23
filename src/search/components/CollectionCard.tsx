import { Typography } from '@mui/material'
import { CollectionResponse } from '../types/SearchResponse'
import ImageCard from './ImageCard'

interface CollectionCardProps extends CollectionResponse {
  cardSize: number
  onClick?: (id: string) => any
}

const getLabel = (name?: string, symbol?: string) => {
  if (name && symbol) {
    return `${name} (${symbol})`
  }

  return name || symbol
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
        <Typography sx={{ fontSize: 12 }}>{getLabel(name, symbol)}</Typography>
      }
      onClick={onClick ? () => onClick(id) : undefined}
      contentHeight="40px"
    />
  )
}

export default CollectionCard
