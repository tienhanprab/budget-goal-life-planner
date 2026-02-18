import { Component, ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
            <div className="bg-white rounded-3xl shadow-xl p-10 max-w-sm text-center border border-gray-100">
              <p className="text-5xl mb-4">😵</p>
              <h2 className="heading-font text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
              <p className="text-gray-500 text-sm mb-6">{this.state.error?.message}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600"
              >
                Reload page
              </button>
            </div>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
