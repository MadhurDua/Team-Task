import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

export class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="grid min-h-screen place-items-center bg-ink p-6 text-center text-white">
          <div className="glass max-w-md rounded-2xl p-8">
            <AlertTriangle className="mx-auto mb-4 text-amber-300" />
            <h1 className="text-2xl font-bold">Something slipped out of place.</h1>
            <p className="mt-2 text-sm text-slate-400">Refresh the page or sign in again to rebuild the workspace state.</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
