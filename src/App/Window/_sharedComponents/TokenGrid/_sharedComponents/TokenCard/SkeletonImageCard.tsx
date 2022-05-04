import { Card, Skeleton } from '@mui/material'
import { Box } from '@mui/system'
import type { ImageCardProps } from './ImageCard/ImageCard'
import TokenCardContentContainer from './_sharedComponents/TokenCardContentContainer'

const SkeletonImageCard = ({
  imageSize,
  contentHeight,
}: Partial<ImageCardProps>) => {
  return (
    <div>
      <Card sx={{ width: imageSize }} square>
        <Skeleton
          sx={{
            height: imageSize,
            width: imageSize,
          }}
          animation="wave"
          variant="rectangular"
        />
        <Box
          sx={{
            height: contentHeight,
            width: '100%',
          }}
        >
          <TokenCardContentContainer />
        </Box>
      </Card>
    </div>
  )
}

export default SkeletonImageCard
