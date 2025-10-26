/**
 * Google Sheets API Integration
 *
 * This module provides utilities for fetching guest table assignments from a public Google Sheet
 * using the Google Sheets API v4. It handles API errors, network failures, and data normalization.
 *
 * API Endpoint: https://sheets.googleapis.com/v4/spreadsheets/{spreadsheetId}/values/{range}?key={apiKey}
 *
 * @module googleSheets
 */

/**
 * Fetches guest table assignments from a public Google Sheet
 *
 * @param {string} spreadsheetId - The Google Sheets spreadsheet ID (from the URL)
 * @param {string} range - The sheet range (e.g., 'Guests!A1:E' - sheet name and cell range)
 * @param {string} apiKey - Google Sheets API key (from environment variable)
 * @returns {Promise<Array<Object>>} Array of guest objects with normalized fields
 * @throws {Error} Descriptive errors for various failure scenarios
 *
 * @example
 * const guests = await fetchTableAssignments(
 *   '1abc123...',
 *   'Guests!A1:E',
 *   'AIza...'
 * );
 * // Returns: [{ firstName: 'John', lastName: 'Doe', fullName: 'John Doe', table: '5', guests: '2' }, ...]
 */
export async function fetchTableAssignments(spreadsheetId, range, apiKey) {
  // Validate API key
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('API key not configured');
  }

  // Validate spreadsheet ID
  if (!spreadsheetId || spreadsheetId.trim() === '') {
    throw new Error('Spreadsheet ID not configured');
  }

  // Validate range
  if (!range || range.trim() === '') {
    throw new Error('Sheet range not configured');
  }

  // Construct Google Sheets API v4 endpoint
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(spreadsheetId)}/values/${encodeURIComponent(range)}?key=${encodeURIComponent(apiKey)}`;

  try {
    // Fetch data from Google Sheets API
    const response = await fetch(url);

    // Handle HTTP errors
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Invalid spreadsheet or range');
      } else if (response.status === 403) {
        throw new Error('API key is invalid or restricted');
      } else if (response.status === 400) {
        throw new Error('Invalid request - check spreadsheet ID and range format');
      } else {
        throw new Error(`Failed to fetch data: HTTP ${response.status}`);
      }
    }

    // Parse JSON response
    const data = await response.json();

    // Validate response structure
    if (!data.values || !Array.isArray(data.values)) {
      throw new Error('Invalid API response format');
    }

    // Check if sheet has data
    if (data.values.length === 0) {
      throw new Error('No data found in sheet');
    }

    // Parse sheet data into guest objects
    const guests = parseSheetData(data);

    // Return normalized guest data
    return guests;
  } catch (error) {
    // Re-throw with context if it's our custom error
    if (error.message.includes('API key') ||
        error.message.includes('spreadsheet') ||
        error.message.includes('Failed to fetch') ||
        error.message.includes('Invalid') ||
        error.message.includes('No data')) {
      throw error;
    }

    // Handle network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error - please check your connection');
    }

    // Generic error fallback
    throw new Error(`Error loading guest data: ${error.message}`);
  }
}

/**
 * Transforms Google Sheets API response into normalized guest objects
 *
 * Expected sheet structure:
 * - First row: headers (e.g., 'First Name', 'Last Name', 'Full Name', 'Table', 'Guests')
 * - Subsequent rows: guest data
 *
 * @param {Object} rawData - API response object containing values array
 * @returns {Array<Object>} Array of normalized guest objects
 *
 * @example
 * const rawData = {
 *   values: [
 *     ['First Name', 'Last Name', 'Full Name', 'Table', 'Guests'],
 *     ['John', 'Doe', 'John Doe', '5', '2'],
 *     ['Jane', 'Smith', 'Jane Smith', '3', '1']
 *   ]
 * };
 * const guests = parseSheetData(rawData);
 */
function parseSheetData(rawData) {
  const values = rawData.values;

  // First row contains headers
  const headers = values[0].map(header => normalizeHeaderName(header));

  // Map remaining rows to guest objects
  const guests = [];

  for (let i = 1; i < values.length; i++) {
    const row = values[i];

    // Skip empty rows
    if (!row || row.length === 0 || row.every(cell => !cell || cell.trim() === '')) {
      continue;
    }

    // Create guest object from row data
    const guest = {};
    headers.forEach((header, index) => {
      guest[header] = row[index] || ''; // Default to empty string for missing cells
    });

    // Normalize the guest data
    const normalizedGuest = normalizeGuestData(guest);

    // Skip guests with missing critical data (no name or table)
    if (!normalizedGuest.fullName || !normalizedGuest.table) {
      continue;
    }

    guests.push(normalizedGuest);
  }

  return guests;
}

/**
 * Normalizes header names to consistent camelCase field names
 *
 * @param {string} header - Raw header string from sheet
 * @returns {string} Normalized camelCase field name
 *
 * @example
 * normalizeHeaderName('First Name') // 'firstName'
 * normalizeHeaderName('full name') // 'fullName'
 */
function normalizeHeaderName(header) {
  const trimmed = header.trim().toLowerCase();

  // Map common header variations to standard field names
  const headerMap = {
    'first name': 'firstName',
    'firstname': 'firstName',
    'first': 'firstName',
    'last name': 'lastName',
    'lastname': 'lastName',
    'last': 'lastName',
    'full name': 'fullName',
    'fullname': 'fullName',
    'name': 'fullName',
    'table': 'table',
    'table number': 'table',
    'table #': 'table',
    'guests': 'guests',
    'guest count': 'guests',
    'party size': 'guests',
  };

  return headerMap[trimmed] || trimmed.replace(/\s+/g, '');
}

/**
 * Cleans and standardizes guest data
 *
 * @param {Object} guest - Raw guest object from sheet
 * @returns {Object} Normalized guest object with consistent fields
 *
 * @example
 * normalizeGuestData({
 *   firstName: '  John  ',
 *   lastName: 'Doe',
 *   fullName: '',
 *   table: 'Table 5',
 *   guests: '2'
 * });
 * // Returns: { firstName: 'John', lastName: 'Doe', fullName: 'John Doe', table: '5', guests: '2' }
 */
export function normalizeGuestData(guest) {
  const normalized = {};

  // Trim all string fields
  Object.keys(guest).forEach(key => {
    const value = guest[key];
    normalized[key] = typeof value === 'string' ? value.trim() : value;
  });

  // Generate fullName if missing but first/last names exist
  if (!normalized.fullName && normalized.firstName && normalized.lastName) {
    normalized.fullName = `${normalized.firstName} ${normalized.lastName}`;
  }

  // Generate fullName from just firstName if that's all we have
  if (!normalized.fullName && normalized.firstName) {
    normalized.fullName = normalized.firstName;
  }

  // Generate fullName from just lastName if that's all we have
  if (!normalized.fullName && normalized.lastName) {
    normalized.fullName = normalized.lastName;
  }

  // Extract first/last names from fullName if missing
  if (normalized.fullName && !normalized.firstName && !normalized.lastName) {
    const nameParts = normalized.fullName.split(/\s+/);
    if (nameParts.length >= 2) {
      normalized.firstName = nameParts[0];
      normalized.lastName = nameParts.slice(1).join(' ');
    } else {
      normalized.firstName = normalized.fullName;
      normalized.lastName = '';
    }
  }

  // Normalize table number (remove 'Table' prefix if present, keep just the number or full text)
  if (normalized.table) {
    // Prefer numeric table number (e.g. '5') to avoid UI rendering "Table Table 5"
    const digits = ('' + normalized.table).match(/\d+/);
    if (digits) {
      normalized.table = digits[0];
    } else {
      // Fallback to trimmed original value (no digits found)
      normalized.table = normalized.table.trim();
    }
  }

  // Ensure guests field exists (default to empty string)
  if (!normalized.guests) {
    normalized.guests = '';
  }

  return normalized;
}
