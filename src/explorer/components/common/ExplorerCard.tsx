import { Box, CircularProgress, Skeleton, Typography } from '@mui/material'
import { PropsWithChildren, Suspense } from 'react'
import range from '../../helpers/range'

export const TableSkeleton = ({ rows = 10 }) => {
  const _range = range(0, rows, 1)
  return (
    <>
      {_range.map((i) => (
        <Skeleton key={i} animation="wave" />
      ))}
    </>
  )
}

type SkeletonType = 'table'

interface ExplorerCardProps {
  title?: string
  skeleton?: SkeletonType
}

export const ExplorerCard = ({
  title,
  skeleton,
  children,
}: PropsWithChildren<ExplorerCardProps>) => {
  const fallback =
    skeleton === 'table' ? <TableSkeleton /> : <CircularProgress />

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
      }}
    >
      {title && (
        <Typography variant="h5" component="h2" gutterBottom>
          {title}
        </Typography>
      )}
      <Suspense fallback={fallback}>{children}</Suspense>
    </Box>
  )
}
