import React, { PropsWithChildren } from 'react';

type ExplorerCardErrorBoundaryProps = {
  fallback: React.SuspenseProps['fallback'];
};

class ExplorerCardErrorBoundary extends React.Component<
  PropsWithChildren<ExplorerCardErrorBoundaryProps>,
  { hasError: boolean }
> {
  constructor(props: ExplorerCardErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(error, errorInfo);
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

export default ExplorerCardErrorBoundary;
