import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled UI Error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-bg-primary flex items-center justify-center p-6 text-text-primary">
          <div className="max-w-md w-full bg-bg-surface border border-status-danger/50 rounded-xl p-8 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-status-danger-dim text-status-danger flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
            <p className="text-sm text-text-secondary mb-6">
              An unexpected UI error occurred. Please reload the page to continue.
            </p>
            {this.state.error && (
              <pre className="text-xs font-mono bg-[#0D1117] p-3 rounded text-terminal-red text-left overflow-x-auto mb-6">
                {this.state.error.message}
              </pre>
            )}
            <Button variant="primary" onClick={this.handleReload} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reload Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
