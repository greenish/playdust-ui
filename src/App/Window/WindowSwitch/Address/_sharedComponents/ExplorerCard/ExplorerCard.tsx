import { Box, CircularProgress, Typography } from '@mui/material';
import React, { PropsWithChildren, Suspense } from 'react';
import ExplorerCardErrorBoundary from './ExplorerCardErrorBoundary';
import TableSkeleton from './TableSkeleton/TableSkeleton';

type SkeletonType = 'table';

interface ExplorerCardProps {
  title?: string;
  fallback: JSX.Element;
}

function ExplorerCard({
  title,
  fallback,
  children,
}: PropsWithChildren<ExplorerCardProps>) {

  return (
    <Box>
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
