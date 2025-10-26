import './LoadingFallback.css';

/**
 * Loading Fallback Component
 *
 * Displays an elegant loading state while code-split components are being loaded.
 * Used as fallback prop in React Suspense boundaries.
 *
 * @param {Object} props - Component props
 * @param {string} props.message - Custom loading message (default: 'Loading...')
 * @param {boolean} props.fullScreen - If true, takes full viewport height (default: false)
 * @param {boolean} props.minimal - If true, shows compact spinner only (default: false)
 */
function LoadingFallback({
  message = 'Loading...',
  fullScreen = false,
  minimal = false
}) {
  // Determine container class based on variants
  const containerClass = [
    'loading-fallback',
    fullScreen && 'loading-fallback-fullscreen',
    minimal && 'loading-fallback-minimal',
    !fullScreen && !minimal && 'loading-fallback-inline',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={containerClass}
      role="status"
      aria-live="polite"
    >
      <div
        className="loading-spinner"
        aria-label="Loading"
      ></div>
      {!minimal && (
        <p className="loading-message">{message}</p>
      )}
    </div>
  );
}

export default LoadingFallback;
