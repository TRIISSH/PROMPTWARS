import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  onHomeClick?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ error, errorInfo });
    
    // Log in development only
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught:', error, errorInfo);
    }
    
    this.props.onError?.(error, errorInfo);
    this.reportError(error, errorInfo);
  }

  private reportError = (error: Error, errorInfo: ErrorInfo): void => {
    try {
      const sanitizedError = {
        name: error.name,
        message: error.message.replace(/([a-zA-Z0-9_-]{20,})/g, '[REDACTED]'),
        componentStack: errorInfo.componentStack?.slice(0, 500),
        timestamp: new Date().toISOString(),
      };
      sessionStorage.setItem('eventos_last_error', JSON.stringify(sanitizedError));
    } catch {
      // Ignore storage errors safely
    }
  };

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleHome = (): void => {
    if (this.props.onHomeClick) {
      this.props.onHomeClick();
    } else {
      window.location.hash = '';
      this.setState({ hasError: false, error: null, errorInfo: null });
    }
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div 
          role="alert" 
          aria-live="assertive"
          className="min-h-[400px] flex items-center justify-center p-6 bg-[#090D16]"
        >
          <div className="glass-card rounded-3xl border border-rose-500/30 p-8 max-w-md w-full text-center shadow-2xl">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-500/20 flex items-center justify-center border border-rose-500/30">
              <AlertTriangle className="w-8 h-8 text-rose-400" />
            </div>
            
            <h2 className="text-xl font-bold text-white mb-2 font-sans">
              System Anomaly Detected
            </h2>
            <p className="text-sm text-slate-300 mb-6 font-mono">
              EventOS recovered gracefully. You can retry rendering or return to the landing overview.
            </p>

            {import.meta.env.DEV && this.state.error && (
              <details className="text-left mb-5 p-3 bg-slate-900/90 rounded-xl border border-white/10">
                <summary className="font-mono text-xs text-slate-400 cursor-pointer select-none">
                  Debug Stack Details
                </summary>
                <pre className="mt-2 text-[10px] text-rose-300 font-mono overflow-auto max-h-36 whitespace-pre-wrap">
                  {this.state.error.message}
                </pre>
              </details>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={this.handleRetry}
                className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs font-mono shadow-neon-indigo transition-all hover:scale-105"
              >
                <RefreshCw className="w-4 h-4 inline mr-1.5" />
                Retry Component
              </button>
              <button
                type="button"
                onClick={this.handleHome}
                className="flex-1 px-4 py-3 rounded-xl bg-slate-800 border border-white/10 hover:bg-slate-700 text-slate-200 font-bold text-xs font-mono transition-all"
              >
                <Home className="w-4 h-4 inline mr-1.5" />
                Return Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Lightweight error boundary for individual widgets & cards
 */
export class ComponentErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode }, 
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback?: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div 
          role="alert"
          className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-center font-mono text-xs text-rose-300"
        >
          <AlertTriangle className="w-4 h-4 text-rose-400 mx-auto mb-1" />
          <span>Module unavailable</span>
        </div>
      );
    }

    return this.props.children;
  }
}