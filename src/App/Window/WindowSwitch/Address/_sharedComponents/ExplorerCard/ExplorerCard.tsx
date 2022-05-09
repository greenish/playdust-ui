import { Box, CircularProgress, Typography } from '@mui/material';
import React, { PropsWithChildren, Suspense } from 'react';
import ExplorerCardErrorBoundary from './ExplorerCardErrorBoundary';
import TableSkeleton from './TableSkeleton';

type SkeletonType = 'table';

interface ExplorerCardProps {
  title?: string;
  skeleton?: SkeletonType;
}

function ExplorerCard({
  title,
  skeleton,
  children,
}: PropsWithChildren<ExplorerCardProps>) {
  const fallback =
    skeleton === 'table' ? <TableSkeleton /> : <CircularProgress />;

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
      }}
    >
      {title && (
        <Typography variant="h5" component="h2" gutterBottom={true}>
          {title}
        </Typography>
      )}
      <ExplorerCardErrorBoundary>
        <Suspense fallback={fallback}>{children}</Suspense>
      </ExplorerCardErrorBoundary>
    </Box>
  );
}

export default ExplorerCard;
