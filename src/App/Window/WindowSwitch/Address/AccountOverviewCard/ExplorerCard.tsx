import { Box, Typography } from '@mui/material';
import React, { PropsWithChildren } from 'react';
import SuspenseBoundary from '../_sharedComponents/SuspenseBoundary/SuspenseBoundary';

interface ExplorerCardProps {
  title?: string;
  loading: React.SuspenseProps['fallback'];
  error: React.SuspenseProps['fallback'];
}

function ExplorerCard({
  title,
  loading,
  error,
  children,
}: PropsWithChildren<ExplorerCardProps>) {
  return (
    <Box>
      {title && (
        <Typography variant="h5" component="h2" gutterBottom={true}>
          {title}
        </Typography>
      )}
      <SuspenseBoundary loading={loading} error={error}>
        {children}
      </SuspenseBoundary>
    </Box>
  );
}

export default ExplorerCard;
