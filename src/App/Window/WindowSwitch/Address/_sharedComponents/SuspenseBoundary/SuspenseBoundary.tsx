import React, { PropsWithChildren, Suspense } from 'react';
import ErrorBoundary from './ErrorBoundary';

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
    <ErrorBoundary fallback={error}>
      <Suspense fallback={loading}>{children}</Suspense>
    </ErrorBoundary>
  );
}

export default SuspenseBoundary;
