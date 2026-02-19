import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            // ✅ Only store error in development
            error: null
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // ✅ Only log in development
        if (import.meta.env.MODE === 'development') {
            console.error('Uncaught error:', error, errorInfo);
        }
        // ✅ In production, you could send to error tracking service
        // e.g., Sentry.captureException(error);
    }

    // ✅ FIX: Add reset mechanism
    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    padding: '2rem',
                    background: '#000',
                    color: '#38bdf8',
                    height: '100vh',
                    fontFamily: 'monospace',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center'
                }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                        Something went wrong.
                    </h1>
                    <p style={{ color: '#a0a0a0', marginBottom: '2rem' }}>
                        We encountered an unexpected error.
                    </p>

                    {/* ✅ Only show details in development */}
                    {import.meta.env.MODE === 'development' && (
                        <details style={{
                            whiteSpace: 'pre-wrap',
                            textAlign: 'left',
                            background: '#111',
                            padding: '1rem',
                            borderRadius: '8px',
                            marginBottom: '2rem',
                            maxWidth: '600px',
                            fontSize: '12px',
                            color: '#ff0080'
                        }}>
                            {this.state.error?.toString()}
                        </details>
                    )}

                    {/* ✅ FIX: Reset button */}
                    <button
                        onClick={this.handleReset}
                        style={{
                            padding: '12px 30px',
                            background: 'transparent',
                            border: '2px solid #38bdf8',
                            color: '#38bdf8',
                            borderRadius: '50px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            letterSpacing: '2px',
                            textTransform: 'uppercase',
                            fontFamily: 'monospace'
                        }}
                    >
                        Try Again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;