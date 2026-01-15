import React, { Component, type ReactNode } from 'react';


interface Props {
    children: ReactNode;
    fallback?: ReactNode;
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
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="fixed inset-0 flex flex-col items-center justify-center bg-black text-white p-6">
                    <div className="max-w-md text-center space-y-4">
                        <div className="text-6xl mb-4">😵</div>
                        <h1 className="text-2xl font-bold">Oops! Something went wrong</h1>
                        <p className="text-gray-400">
                            We're sorry, but something unexpected happened. Please try refreshing the page.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition-colors"
                        >
                            Reload App
                        </button>
                        {this.state.error && (
                            <details className="mt-4 text-left text-xs text-gray-500">
                                <summary className="cursor-pointer">Error Details</summary>
                                <pre className="mt-2 p-2 bg-gray-900 rounded overflow-auto">
                                    {this.state.error.toString()}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
