import { useState, useEffect, useRef } from 'react';
import Section from '../ui/Section.jsx';
import Card from '../ui/Card.jsx';
import Button from '../ui/Button.jsx';
import { fetchTableAssignments } from '../../utils/googleSheets.js';
import { fuzzySearchGuests } from '../../utils/fuzzySearch.js';
import './TableLookup.css';

/**
 * TableLookup Component
 *
 * Guest table assignment lookup with Google Sheets integration and fuzzy search.
 * Fetches guest data from a public Google Sheet and provides a search interface
 * with flexible name matching.
 *
 * @param {Object} props - Component props
 * @param {string} props.spreadsheetId - Google Sheets spreadsheet ID (optional, defaults to env)
 * @param {string} props.sheetRange - Sheet range like 'Guests!A1:E' (optional, default 'Guests!A1:E')
 * @param {string} props.title - Section title (optional, default 'Find Your Table')
 * @param {string} props.subtitle - Section subtitle (optional)
 * @param {string} props.searchPlaceholder - Input placeholder (optional, default 'Enter your name...')
 * @param {number} props.maxResults - Max results for multiple matches (optional, default 5)
 */
function TableLookup({
  spreadsheetId,
  sheetRange = 'Guests!A1:E',
  title = 'Find Your Table',
  subtitle = 'Enter your name to find your table assignment',
  searchPlaceholder = 'Enter your name...',
  maxResults = 5,
}) {
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [guests, setGuests] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [loadingState, setLoadingState] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Refs
  const inputRef = useRef(null);

  // Effect 1 - Fetch guest data on mount
  useEffect(() => {
    async function loadGuestData() {
      // Get configuration from props or environment variables
      const apiKey = import.meta.env.VITE_GOOGLE_SHEETS_API_KEY;
      const sheetId = spreadsheetId || import.meta.env.VITE_GOOGLE_SHEETS_SPREADSHEET_ID;

      // Validate configuration
      if (!apiKey) {
        setErrorMessage('Table lookup is not configured. Please contact the wedding organizers.');
        setLoadingState('error');
        return;
      }

      if (!sheetId) {
        setErrorMessage('Guest list configuration is missing. Please contact the wedding organizers.');
        setLoadingState('error');
        return;
      }

      // Set loading state
      setLoadingState('loading');

      try {
        // Fetch guest data from Google Sheets
        const guestData = await fetchTableAssignments(sheetId, sheetRange, apiKey);

        // Store guests and mark as success
        setGuests(guestData);
        setLoadingState('success');
      } catch (error) {
        // Handle different error types
        let userFriendlyMessage = 'Unable to load guest list. Please try again later.';

        if (error.message.includes('API key')) {
          userFriendlyMessage = 'Table lookup is not configured. Please contact the wedding organizers.';
        } else if (error.message.includes('Network error')) {
          userFriendlyMessage = 'Unable to load guest list. Please check your connection and try again.';
        } else if (error.message.includes('Invalid spreadsheet')) {
          userFriendlyMessage = 'Guest list not found. Please contact the wedding organizers.';
        } else if (error.message.includes('No data')) {
          userFriendlyMessage = 'Guest list is currently empty. Please contact the wedding organizers.';
        }

        setErrorMessage(userFriendlyMessage);
        setLoadingState('error');
      }
    }

    loadGuestData();
  }, []); // Run once on mount

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();

    // Validate input
    if (!searchQuery || searchQuery.trim().length < 2) {
      return;
    }

    // Check if data is loaded
    if (!guests || loadingState !== 'success') {
      return;
    }

    // Perform fuzzy search
    const results = fuzzySearchGuests(searchQuery, guests, {
      maxDistance: 3,
      minSimilarity: 0.6,
    });

    // Set results and mark as searched
    setSearchResults(results);
    setHasSearched(true);
  };

  // Handle input change
  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    // Reset search state when user types
    setHasSearched(false);
    setSearchResults(null);
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults(null);
    setHasSearched(false);
    // Focus input
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <Section id="table-lookup" background="light" padding="large">
      {/* Section Header */}
      <div className="table-lookup-header">
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>

      {/* Search Form */}
      <div className="table-lookup-form">
        <Card variant="elevated" padding="large">
          <form onSubmit={handleSearch}>
            <div className="search-input-group">
              <label htmlFor="guest-search" className="search-label">
                Guest Name
              </label>
              <input
                id="guest-search"
                ref={inputRef}
                type="text"
                className="search-input"
                value={searchQuery}
                onChange={handleInputChange}
                placeholder={searchPlaceholder}
                disabled={loadingState === 'loading' || loadingState === 'error'}
                aria-label="Search for your name"
                autoComplete="off"
              />
              <Button
                type="submit"
                variant="primary"
                disabled={searchQuery.trim().length < 2 || loadingState !== 'success'}
              >
                {loadingState === 'loading' ? 'Loading...' : 'Find My Table'}
              </Button>
            </div>
          </form>
        </Card>
      </div>

      {/* Loading State */}
      {loadingState === 'loading' && (
        <div className="table-lookup-loading">
          <div className="loading-spinner" aria-label="Loading"></div>
          <p>Loading guest list...</p>
        </div>
      )}

      {/* Error State */}
      {loadingState === 'error' && (
        <div className="table-lookup-error">
          <Card padding="large">
            <div className="error-content">
              <span className="error-icon" aria-hidden="true">⚠️</span>
              <p className="error-message">{errorMessage}</p>
            </div>
          </Card>
        </div>
      )}

      {/* Search Results */}
      {hasSearched && loadingState === 'success' && (
        <div className="table-lookup-results" role="region" aria-live="polite">
          {/* No Results */}
          {searchResults && searchResults.length === 0 && (
            <div className="no-results">
              <Card padding="large">
                <span className="no-results-icon" aria-hidden="true">🔍</span>
                <p className="no-results-message">
                  We couldn't find a match for "{searchQuery}". Please check the spelling or try a different name.
                </p>
                <div className="no-results-suggestions">
                  <p><strong>Suggestions:</strong></p>
                  <ul>
                    <li>Try using your full name</li>
                    <li>Check for typos</li>
                    <li>Contact us if you need assistance</li>
                  </ul>
                </div>
                <Button variant="secondary" onClick={handleClearSearch}>
                  Try Again
                </Button>
              </Card>
            </div>
          )}

          {/* Single Result */}
          {searchResults && searchResults.length === 1 && (
            <div className="result-success animate-fade-in-up">
              <Card variant="elevated" padding="large">
                <p className="result-guest-name">{searchResults[0].guest.fullName}</p>
                <div className="result-table">
                  <span className="table-label">You're seated at</span>
                  <span className="table-number">Table {searchResults[0].guest.table}</span>
                </div>
                {searchResults[0].guest.guests && (
                  <p className="result-guests">Party of {searchResults[0].guest.guests}</p>
                )}
                <p className="result-message">We look forward to celebrating with you!</p>
                <Button variant="secondary" onClick={handleClearSearch}>
                  Search Again
                </Button>
              </Card>
            </div>
          )}

          {/* Multiple Results */}
          {searchResults && searchResults.length > 1 && (
            <div className="multiple-results">
              <p className="multiple-results-header">
                We found {searchResults.length} possible matches. Please select your name:
              </p>
              <div className="results-list">
                {searchResults.slice(0, maxResults).map((result, index) => (
                  <Card
                    key={index}
                    className="result-item animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    padding="medium"
                  >
                    <p className="result-item-name">{result.guest.fullName}</p>
                    <p className="result-item-table">Table {result.guest.table}</p>
                    {result.guest.guests && (
                      <p className="result-item-guests">Party of {result.guest.guests}</p>
                    )}
                  </Card>
                ))}
              </div>
              {searchResults.length > maxResults && (
                <p className="results-overflow">
                  Showing first {maxResults} results. Try a more specific name.
                </p>
              )}
              <Button variant="secondary" onClick={handleClearSearch}>
                Search Again
              </Button>
            </div>
          )}
        </div>
      )}
    </Section>
  );
}

export default TableLookup;
