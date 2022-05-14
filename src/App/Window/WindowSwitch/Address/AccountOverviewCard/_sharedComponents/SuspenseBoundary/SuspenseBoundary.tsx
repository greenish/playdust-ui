import React, { PropsWithChildren, Suspense } from 'react';
import ExplorerCardErrorBoundary from './ExplorerCardErrorBoundary';

interface ExplorerCardProps {
  loading: React.SuspenseProps["fallback"];
  error: React.SuspenseProps["fallback"]
}
function SuspenseBoundary({
  loading,
  error,
  children,
}: PropsWithChildren<ExplorerCardProps>) {
  return (
      <ExplorerCardErrorBoundary fallback={error}>
        <Suspense fallback={loading}>{children}</Suspense>
      </ExplorerCardErrorBoundary>
  );
}

export default SuspenseBoundary;
