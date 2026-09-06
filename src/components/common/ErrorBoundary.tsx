import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6 bg-slate-50 dark:bg-[#111215] text-slate-900 dark:text-zinc-100">
          <div className="max-w-md w-full p-6 rounded-2xl bg-white dark:bg-[#18181c] border border-slate-200 dark:border-zinc-800 shadow-xl text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Something went wrong
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                An unexpected interface error occurred. Your active cart data and state are preserved in local cache.
              </p>
            </div>
            {this.state.error && (
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-zinc-800/80 text-left font-mono text-[11px] text-slate-700 dark:text-zinc-300 max-h-32 overflow-y-auto">
                {this.state.error.message || 'Unknown error'}
              </div>
            )}
            <button
              onClick={this.handleReset}
              className="w-full py-2.5 px-4 rounded-xl bg-[#0c831f] hover:bg-[#0a6e1a] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
            >
              <RefreshCw className="w-4 h-4" />
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
