import React, { PropsWithChildren, Suspense } from 'react';
import ExplorerCardErrorBoundary from './ExplorerCardErrorBoundary';

interface ExplorerCardProps {
  loading: React.SuspenseProps['fallback'];
  error: React.SuspenseProps['fallback'];
  shouldRender?: boolean;
}
function SuspenseBoundary({
  loading,
  error,
  children,
  shouldRender = true,
}: PropsWithChildren<ExplorerCardProps>) {
  return !shouldRender ? null : (
    <ExplorerCardErrorBoundary fallback={error}>
      <Suspense fallback={loading}>{children}</Suspense>
    </ExplorerCardErrorBoundary>
  );
}

export default SuspenseBoundary;
