import React, { ReactNode } from 'react';

type ExplorerCardErrorBoundaryProps = { children?: ReactNode | undefined };

class ExplorerCardErrorBoundary extends React.Component<
  ExplorerCardErrorBoundaryProps,
  { hasError: boolean }
> {
  constructor(props: ExplorerCardErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong.</div>;
    }

    return this.props.children;
  }
}

export default ExplorerCardErrorBoundary;
