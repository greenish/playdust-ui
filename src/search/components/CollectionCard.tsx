import { Card, CardContent, Typography } from '@mui/material'
import { CollectionResponse } from '../types/SearchResponse'

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
    <Card
      sx={{
        height: cardSize,
        width: cardSize,
        minWidth: cardSize,
        mr: 2,
        cursor: onClick ? 'pointer' : 'auto',
      }}
      onClick={() => onClick && onClick(id)}
    >
      <CardContent
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }}
      >
        <Typography sx={{ fontSize: 14 }}>{getLabel(name, symbol)}</Typography>
      </CardContent>
    </Card>
  )
}

export default CollectionCard
