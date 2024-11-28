import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error
        };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Error details:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="text-center p-4">
                    <h1 className="text-xl font-bold text-red-600">Something went wrong</h1>
                    <p className="text-gray-600">{this.state.error?.message}</p>
                </div>
            );
        }

        return this.props.children;
    }
} 