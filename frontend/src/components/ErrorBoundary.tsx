import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';
import { Button } from './ui/Button';

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
    console.error('Uncaught React UI error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/dashboard';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-6">
          <div className="max-w-lg w-full bg-slate-800 border border-slate-700/80 rounded-2xl p-8 text-center shadow-2xl space-y-6">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto text-red-400">
              <AlertOctagon className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100">Application Error Caught</h2>
              <p className="text-sm text-slate-400 mt-2">
                An unexpected UI rendering exception occurred. The error details have been logged to the engineering console.
              </p>
            </div>
            {this.state.error && (
              <div className="bg-slate-900 border border-slate-700/60 rounded-xl p-4 text-left overflow-x-auto">
                <code className="text-xs font-mono text-red-300">
                  {this.state.error.toString()}
                </code>
              </div>
            )}
            <Button
              variant="primary"
              size="md"
              onClick={this.handleReset}
              leftIcon={<RotateCcw className="w-4 h-4" />}
              className="w-full"
            >
              Return to Dashboard
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
