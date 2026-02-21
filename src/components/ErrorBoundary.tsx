import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Uncaught error:', error);
    console.error('[ErrorBoundary] Component stack:', errorInfo.componentStack);
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="min-h-screen bg-surface-base flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="text-5xl">&#x2727;</div>
          <h1 className="text-2xl font-bold text-theme-text-primary">Something went wrong</h1>
          <p className="text-theme-text-secondary text-sm">
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-white text-neutral-900 rounded-lg font-medium hover:bg-neutral-200 transition-colors"
            >
              Reload page
            </button>
            <a
              href="/"
              className="text-theme-text-secondary hover:text-theme-text-primary transition-colors text-sm underline"
            >
              Go to Home
            </a>
          </div>
          {/* Known limitations: This boundary does not catch async errors outside render or event handler errors. */}
        </div>
      </div>
    );
  }
}
