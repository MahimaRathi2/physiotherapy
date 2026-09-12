import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', background: '#fff', color: '#990000', fontFamily: 'monospace', minHeight: '100vh', zIndex: 99999, position: 'relative' }}>
          <h2>⚠️ React Component Render Error Caught</h2>
          <pre style={{ background: '#f8d7da', padding: '1rem', borderRadius: '8px', overflowX: 'auto' }}>
            {this.state.error && this.state.error.toString()}
          </pre>
          <details style={{ marginTop: '1rem', whiteSpace: 'pre-wrap' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>View Stack Trace</summary>
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: '1.5rem', padding: '0.5rem 1rem', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
