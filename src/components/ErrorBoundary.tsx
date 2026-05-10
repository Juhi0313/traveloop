import { Component, type ReactNode } from 'react';

interface State { error: Error | null }

export default class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 40, fontFamily: 'monospace', background: '#fff1f2', minHeight: '100vh' }}>
          <h1 style={{ color: '#dc2626', fontSize: 24, marginBottom: 16 }}>App crashed — error details:</h1>
          <pre style={{ background: '#fff', border: '1px solid #fca5a5', borderRadius: 8, padding: 16, whiteSpace: 'pre-wrap', wordBreak: 'break-all', color: '#1e293b', fontSize: 13 }}>
            {this.state.error.message}
            {'\n\n'}
            {this.state.error.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
