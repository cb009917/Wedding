import React from 'react';
import './ErrorBoundary.css';

/**
 * Error Boundary Component
 *
 * Catches JavaScript errors anywhere in the component tree and displays
 * an elegant fallback UI instead of crashing the entire application.
 *
 * Note: Error Boundaries must be class components (React requirement).
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  /**
   * Update state when an error is caught
   * This lifecycle method is called during the "render" phase
   */
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  /**
   * Log error details for debugging
   * This lifecycle method is called during the "commit" phase
   */
  componentDidCatch(error, errorInfo) {
    // Log to console for debugging
    console.error('Error caught by boundary:', error, errorInfo);

    // Store error info in state for display
    this.setState({
      errorInfo,
    });

    // In production, you could send to error tracking service:
    // logErrorToService(error, errorInfo);
  }

  /**
   * Reset error state (for retry functionality)
   */
  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    // Call optional onReset callback
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  /**
   * Reload the page
   */
  handleReload = () => {
    window.location.reload();
  };

  /**
   * Navigate to home
   */
  handleGoHome = () => {
    // Use BASE_URL from Vite to support flexible deployments
    window.location.href = import.meta.env.BASE_URL;
  };

  render() {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback } = this.props;

    // If no error, render children normally
    if (!hasError) {
      return children;
    }

    // If custom fallback provided, use it
    if (fallback) {
      return fallback;
    }

    // Render default fallback UI
    const isDevelopment = import.meta.env.DEV;

    return (
      <div className="error-boundary-container">
        <div className="error-boundary-content">
          <div className="error-boundary-icon" aria-hidden="true">
            ⚠️
          </div>

          <h1 className="error-boundary-heading">
            Oops! Something went wrong
          </h1>

          <p className="error-boundary-message">
            We're sorry, but something unexpected happened. Please try refreshing the page or returning to the home page.
          </p>

          {/* Show error details in development only */}
          {isDevelopment && error && (
            <details className="error-boundary-details">
              <summary>Error Details (Development Only)</summary>
              <div className="error-boundary-details-content">
                <p><strong>Error:</strong> {error.toString()}</p>
                {errorInfo && errorInfo.componentStack && (
                  <pre>{errorInfo.componentStack}</pre>
                )}
              </div>
            </details>
          )}

          <div className="error-boundary-actions">
            <button
              className="button button-primary"
              onClick={this.handleReload}
              type="button"
            >
              Refresh Page
            </button>
            <button
              className="button button-secondary"
              onClick={this.handleGoHome}
              type="button"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
