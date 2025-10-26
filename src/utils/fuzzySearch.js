/**
 * Fuzzy Search Utilities
 *
 * Lightweight fuzzy search implementation for flexible name matching.
 * Handles typos, partial names, case variations, and different name formats.
 * Uses Levenshtein distance algorithm for similarity scoring.
 *
 * No external dependencies - keeps bundle size minimal.
 *
 * @module fuzzySearch
 */

/**
 * Search for guests matching a query string using fuzzy matching
 *
 * @param {string} query - User's search input
 * @param {Array<Object>} guests - Array of guest objects from Google Sheets
 * @param {Object} options - Search configuration options
 * @param {number} options.maxDistance - Maximum Levenshtein distance for matches (default: 2)
 * @param {number} options.minSimilarity - Minimum similarity score 0-1 (default: 0.7)
 * @param {Array<string>} options.searchFields - Fields to search (default: ['fullName', 'firstName', 'lastName'])
 * @returns {Array<Object>} Array of match objects with guest, score, and matchedField
 *
 * @example
 * const results = fuzzySearchGuests('jon smith', guests, { maxDistance: 2 });
 * // Returns: [{ guest: {...}, score: 0.95, matchedField: 'fullName' }, ...]
 */
export function fuzzySearchGuests(query, guests, options = {}) {
  // Default options
  const {
    maxDistance = 3,
    minSimilarity = 0.6,
    searchFields = ['fullName', 'firstName', 'lastName'],
  } = options;

  // Handle empty query
  if (!query || query.trim().length === 0) {
    return [];
  }

  // Normalize query
  const normalizedQuery = normalizeString(query);

  // Handle very short queries (require higher similarity)
  const effectiveMinSimilarity = normalizedQuery.length <= 2 ? 0.8 : minSimilarity;

  // Search each guest and collect matches
  const matches = [];

  guests.forEach(guest => {
    const matchResult = matchGuest(normalizedQuery, guest, searchFields, maxDistance);

    if (matchResult) {
      const { score, matchedField, distance } = matchResult;

      // Filter by similarity threshold
      if (score >= effectiveMinSimilarity) {
        matches.push({
          guest,
          score,
          matchedField,
          distance,
        });
      }
    }
  });

  // Sort by score (descending - higher is better)
  matches.sort((a, b) => b.score - a.score);

  return matches;
}

/**
 * Normalize a string for comparison
 * - Convert to lowercase
 * - Trim whitespace
 * - Remove extra spaces
 * - Remove common punctuation
 *
 * @param {string} str - String to normalize
 * @returns {string} Normalized string
 *
 * @example
 * normalizeString('  John  Smith  ') // 'john smith'
 * normalizeString('O\'Brien') // 'obrien'
 */
export function normalizeString(str) {
  if (!str || typeof str !== 'string') {
    return '';
  }

  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/[.,\-']/g, '') // Remove common punctuation
    .normalize('NFD') // Normalize unicode (for diacritics)
    .replace(/[\u0300-\u036f]/g, ''); // Remove diacritics
}

/**
 * Calculate Levenshtein distance between two strings
 * (minimum number of edits needed to transform one string into another)
 *
 * Uses optimized dynamic programming with single array.
 *
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} Edit distance (lower is better, 0 is exact match)
 *
 * @example
 * levenshteinDistance('kitten', 'sitting') // 3
 * levenshteinDistance('john', 'jon') // 1
 */
export function levenshteinDistance(str1, str2) {
  // Early exit for identical strings
  if (str1 === str2) {
    return 0;
  }

  // Handle empty strings
  if (str1.length === 0) return str2.length;
  if (str2.length === 0) return str1.length;

  // Trim common prefix
  let start = 0;
  while (start < str1.length && start < str2.length && str1[start] === str2[start]) {
    start++;
  }
  str1 = str1.slice(start);
  str2 = str2.slice(start);

  // Trim common suffix
  let end1 = str1.length - 1;
  let end2 = str2.length - 1;
  while (end1 >= 0 && end2 >= 0 && str1[end1] === str2[end2]) {
    end1--;
    end2--;
  }
  str1 = str1.slice(0, end1 + 1);
  str2 = str2.slice(0, end2 + 1);

  // Handle empty strings after trimming
  if (str1.length === 0) return str2.length;
  if (str2.length === 0) return str1.length;

  // Use single array for memory efficiency
  const len1 = str1.length;
  const len2 = str2.length;
  const row = new Array(len2 + 1);

  // Initialize first row
  for (let i = 0; i <= len2; i++) {
    row[i] = i;
  }

  // Calculate distances
  for (let i = 1; i <= len1; i++) {
    let prev = i;

    for (let j = 1; j <= len2; j++) {
      const val = row[j];

      if (str1[i - 1] === str2[j - 1]) {
        // Use the diagonal value when characters are equal (prev holds diagonal)
        // This fixes incorrect distances where the left cell was used instead of diagonal.
        row[j] = prev; // No change needed (diagonal)
      } else {
        row[j] = Math.min(
          row[j - 1] + 1,  // Insertion
          prev + 1,        // Deletion
          row[j] + 1       // Substitution
        );
      }

      prev = val;
    }
  }

  return row[len2];
}

/**
 * Calculate similarity score between two strings (0-1)
 * Based on Levenshtein distance normalized by string length
 *
 * @param {string} str1 - First string
 * @param {string} str2 - Second string
 * @returns {number} Similarity score (0 = no match, 1 = exact match)
 *
 * @example
 * calculateSimilarity('john', 'jon') // 0.75
 * calculateSimilarity('smith', 'smith') // 1.0
 */
export function calculateSimilarity(str1, str2) {
  // Handle empty strings
  if (!str1 || !str2) {
    return 0;
  }

  // Calculate distance
  const distance = levenshteinDistance(str1, str2);

  // Normalize by max length
  const maxLength = Math.max(str1.length, str2.length);

  // Convert to similarity score (0-1)
  return 1 - (distance / maxLength);
}

/**
 * Match a query against a single guest across multiple fields
 * Returns the best match score and which field matched
 *
 * @param {string} normalizedQuery - Normalized search query
 * @param {Object} guest - Guest object to search
 * @param {Array<string>} searchFields - Fields to search in guest object
 * @returns {Object|null} Match result with score and matchedField, or null if no match
 *
 * @example
 * matchGuest('john', { firstName: 'John', lastName: 'Doe', fullName: 'John Doe' }, ['fullName', 'firstName'])
 * // Returns: { score: 1.0, matchedField: 'firstName' }
 */
function matchGuest(normalizedQuery, guest, searchFields, maxDistance = Infinity) {
  let bestScore = 0;
  let bestField = null;

  // Ensure maxDistance is numeric if provided
  if (maxDistance == null) {
    maxDistance = Infinity;
  }

  // Try each search field
  searchFields.forEach(field => {
    const fieldValue = guest[field];

    if (!fieldValue) {
      return; // Skip empty fields
    }

    const normalizedField = normalizeString(fieldValue);

    // Calculate Levenshtein distance and enforce maxDistance if provided
    const distance = levenshteinDistance(normalizedQuery, normalizedField);
    if (typeof maxDistance === 'number' && distance > maxDistance) {
      return; // skip this field if too far
    }

    // Calculate base similarity score
    let score = calculateSimilarity(normalizedQuery, normalizedField);

    // Bonus for substring matches (query is contained in field)
    if (normalizedField.includes(normalizedQuery)) {
      score = Math.max(score, 0.85); // Boost score for substring matches
    }

    // Bonus for exact prefix match
    if (normalizedField.startsWith(normalizedQuery)) {
      score = Math.max(score, 0.9); // Higher boost for prefix matches
    }

    // Track best match
    if (score > bestScore) {
      bestScore = score;
      bestField = field;
    }
  });

  // Also try matching against combined first+last name (if both exist)
  if (guest.firstName && guest.lastName) {
    const combinedName = normalizeString(`${guest.firstName} ${guest.lastName}`);
    const combinedDistance = levenshteinDistance(normalizedQuery, combinedName);
    if (typeof maxDistance === 'number' && combinedDistance <= maxDistance) {
      let score = calculateSimilarity(normalizedQuery, combinedName);

      // Substring bonus
      if (combinedName.includes(normalizedQuery)) {
        score = Math.max(score, 0.85);
      }

      // Prefix bonus
      if (combinedName.startsWith(normalizedQuery)) {
        score = Math.max(score, 0.9);
      }

      if (score > bestScore) {
        bestScore = score;
        bestField = 'fullName';
      }
    }
  }

  // Also try matching against reversed name (Last, First format)
  if (guest.firstName && guest.lastName) {
    const reversedName = normalizeString(`${guest.lastName} ${guest.firstName}`);
    const reversedDistance = levenshteinDistance(normalizedQuery, reversedName);
    if (typeof maxDistance === 'number' && reversedDistance <= maxDistance) {
      let score = calculateSimilarity(normalizedQuery, reversedName);

      // Substring bonus
      if (reversedName.includes(normalizedQuery)) {
        score = Math.max(score, 0.85);
      }

      // Prefix bonus
      if (reversedName.startsWith(normalizedQuery)) {
        score = Math.max(score, 0.9);
      }

      if (score > bestScore) {
        bestScore = score;
        bestField = 'fullName';
      }
    }
  }

  // Return best match or null if no good match found
  if (bestScore > 0) {
    // Also include the distance for the best field as supplemental info
    // Compute distance against the bestField for the return value
    let distance = null;
    try {
      if (bestField && guest[bestField]) {
        distance = levenshteinDistance(normalizedQuery, normalizeString(guest[bestField]));
      } else if (guest.firstName && guest.lastName) {
        distance = levenshteinDistance(normalizedQuery, normalizeString(`${guest.firstName} ${guest.lastName}`));
      }
    } catch (e) {
      distance = null;
    }

    return { score: bestScore, matchedField: bestField, distance };
  }

  return null;
}
