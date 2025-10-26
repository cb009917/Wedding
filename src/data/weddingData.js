// Centralized wedding data configuration
// Update this file to customize all wedding information

export const coupleInfo = {
  bride: 'Anna',
  groom: 'James',
  initials: 'A & J',
  tagline: 'Join us as we celebrate our special day',
};

export const weddingDate = {
  // ISO format with timezone for CountdownTimer - update timezone as needed
  // Using local timezone (no Z suffix) will use browser's local time
  // Use 'Z' suffix for UTC, or specify offset like '-05:00' for EST
  date: '2026-06-15T16:00:00', // Local timezone (browser's timezone)
  displayDate: 'June 15, 2026',
  displayTime: '4:00 PM',
};

export const ceremonyDetails = {
  date: 'June 15, 2026',
  time: '4:00 PM',
  venue: 'Garden Venue',
  address: '123 Garden Lane',
  city: 'Springfield',
  state: 'IL',
  zip: '62701',
  country: 'USA',
};

export const receptionDetails = {
  date: 'June 15, 2026',
  time: '6:00 PM',
  venue: 'Ballroom Hall',
  address: '456 Celebration Ave',
  city: 'Springfield',
  state: 'IL',
  zip: '62701',
  country: 'USA',
};

export const dressCode = {
  title: 'Formal Attire',
  description: 'Romantic & Elegant',
  notes: 'Blush and gold tones encouraged',
};

export const storyIntroduction =
  'Every love story is unique, but ours is our favorite. From our first meeting to this special day, every moment has led us here.';

export const storyTimeline = [
  {
    date: '2018-03-15',
    title: 'First Met',
    description:
      'We met at a coffee shop on a rainy spring morning. What started as a casual conversation turned into hours of laughter and connection.',
  },
  {
    date: '2018-06-20',
    title: 'First Date',
    description:
      'Our first official date was a picnic in the park. Under the summer sun, we realized this was the beginning of something special.',
  },
  {
    date: '2020-12-24',
    title: 'Engagement',
    description:
      'James proposed on Christmas Eve under the stars. With tears of joy and an overwhelming "yes," we began planning our forever.',
  },
  {
    date: '2024-06-15',
    title: 'Wedding Day',
    description:
      'The day we say "I do" and begin our forever together, surrounded by the love and support of our family and friends.',
  },
];

export const venueLocation = {
  name: 'Garden Venue',
  address: '123 Garden Lane',
  city: 'Springfield',
  state: 'IL',
  zip: '62701',
  country: 'USA',
  coordinates: {
    lat: 39.7817,
    lng: -89.6501,
  },
  additionalInfo: 'Free parking available. Venue is wheelchair accessible.',
};

// Photo Gallery Data
// IMPORTANT: For Vite production builds, use one of these approaches:
// 1. Place photos in public/photos/ and reference as '/photos/ceremony-1.jpg'
// 2. Import photos and use the imported URL: import ceremony1 from './assets/photos/ceremony-1.jpg'
// Optimal image dimensions: 1200px width for full-size images, 400px for thumbnails
// Thumbnail property is optional and will fall back to src if not provided
export const galleryPhotos = [
  {
    id: 1,
    src: '/photos/ceremony-1.jpg',
    alt: 'Ceremony moment',
    caption: 'Walking down the aisle',
  },
  {
    id: 2,
    src: '/photos/reception-1.jpg',
    alt: 'Reception celebration',
    caption: 'First dance',
  },
  {
    id: 3,
    src: '/photos/ceremony-2.jpg',
    alt: 'Exchanging vows',
    caption: 'Our vows to each other',
  },
  {
    id: 4,
    src: '/photos/reception-2.jpg',
    alt: 'Wedding cake cutting',
    caption: 'Cutting the cake together',
  },
  {
    id: 5,
    src: '/photos/portraits-1.jpg',
    alt: 'Couple portrait',
    caption: 'Just married',
  },
  {
    id: 6,
    src: '/photos/reception-3.jpg',
    alt: 'Celebrating with guests',
    caption: 'Dancing the night away',
  },
  {
    id: 7,
    src: '/photos/ceremony-3.jpg',
    alt: 'Ring exchange',
    caption: 'Exchanging rings',
  },
  {
    id: 8,
    src: '/photos/portraits-2.jpg',
    alt: 'Outdoor couple photo',
    caption: 'Golden hour portraits',
  },
];

// Google Sheets Configuration for Table Lookup
// This configuration is used by the TableLookup component to fetch guest data
// The spreadsheet must be shared as "Anyone with the link can view"
// Get your spreadsheet ID from the URL: https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
// API key should be stored in .env file as VITE_GOOGLE_SHEETS_API_KEY
// Spreadsheet ID can be stored here or in .env as VITE_GOOGLE_SHEETS_SPREADSHEET_ID
//
// Expected sheet structure with column headers (first row):
// First Name | Last Name | Full Name | Table | Guests (optional)
//
// Example data format:
// John       | Smith     | John Smith | 5     | 2
// Jane       | Doe       | Jane Doe   | 3     | 1
export const googleSheetsConfig = {
  spreadsheetId: 'https://docs.google.com/spreadsheets/d/1Do7hgEA6x9jwmT9wspZLbUro-XL1b-KyrM-NSy5-zxw/edit?usp=sharing', // Or use import.meta.env.VITE_GOOGLE_SHEETS_SPREADSHEET_ID
  sheetRange: 'Guests!A1:E', // Sheet name and cell range
};

// Default export with all data combined
export default {
  coupleInfo,
  weddingDate,
  ceremonyDetails,
  receptionDetails,
  dressCode,
  storyIntroduction,
  storyTimeline,
  venueLocation,
  galleryPhotos,
  googleSheetsConfig,
};
