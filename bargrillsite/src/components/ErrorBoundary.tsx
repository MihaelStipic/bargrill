import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary uhvatio grešku:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <AlertTriangle size={64} className="text-[#c4a484] mx-auto mb-6" />
            <h1 className="text-2xl text-[#e5d3b3] mb-4">Ups! Nešto je pošlo krivo</h1>
            <p className="text-[#a89c84] mb-8">
              Došlo je do greške u aplikaciji. Pokušajte osvježiti stranicu.
            </p>
            <button
              onClick={this.handleReload}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#c4a484] text-[#1a1a1a] font-bold rounded hover:bg-[#b39373] transition-colors"
            >
              <RefreshCw size={18} />
              Osvježi stranicu
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
