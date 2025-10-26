# Wedding Website

A React-based wedding website for table assignments and guest information.

## Description

This project provides a clean, interactive interface for wedding guests to view their table assignments and other wedding-related information. Built with React and Vite for fast development and optimal performance.

## Prerequisites

- Node.js (version 18.x or higher recommended)
- npm or yarn package manager

## Installation

Clone the repository and install dependencies:

```bash
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the next available port).

**Note:** Ensure `.env` file is created before running dev server (copy from `.env.example` and fill in your API keys).

## Build

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Deployment to GitHub Pages

This project is configured for deployment to GitHub Pages:

1. Ensure the `base` path in `vite.config.js` matches your repository name
2. Install dependencies: `npm install`
3. Deploy: `npm run deploy`

The site will be published to `https://<username>.github.io/Wedding/`

### Manual Deployment Steps

If needed, you can deploy manually:

```bash
npm run build
npx gh-pages -d dist
```

## Project Structure

### Components
- **`src/components/HeroSection.jsx`** - Landing section with couple names and wedding date
- **`src/components/WeddingDetails.jsx`** - Ceremony, reception, and dress code information
- **`src/components/StorySection.jsx`** - Couple's love story timeline
- **`src/components/CountdownTimer.jsx`** - Real-time countdown to wedding date
- **`src/components/DirectionsSection.jsx`** - Venue location with Google Maps embed
- **`src/components/Gallery/PhotoGallery.jsx`** - Main gallery component with responsive grid
- **`src/components/Gallery/Lightbox.jsx`** - Modal component for full-size image viewing
- **`src/components/TableLookup/TableLookup.jsx`** - Guest table assignment lookup with search
- **`src/components/Layout/`** - Layout components (Header, Footer, Layout wrapper)
- **`src/components/ui/`** - Reusable UI components (Button, Card, Section)

### Data & Styles
- **`src/data/weddingData.js`** - Centralized wedding information data (including galleryPhotos and googleSheetsConfig)
- **`public/photos/`** - Directory for wedding gallery images (served as-is by Vite)
- **`src/assets/`** - Static assets (images, fonts, icons)
- **`src/styles/`** - Design system (variables, global styles, animations)
- **`src/utils/`** - Utility functions and helper modules
  - **`src/utils/googleSheets.js`** - Google Sheets API integration for fetching guest data
  - **`src/utils/fuzzySearch.js`** - Fuzzy name matching algorithm for flexible search

**Note:** `src/assets/photos/` can be used as an alternative if you prefer importing images in `weddingData.js`, but `public/photos/` is the recommended default approach (see [Adding Photos](#adding-photos)).

## Customization

### Wedding Information

Edit `src/data/weddingData.js` to customize all wedding information:

```javascript
// Update couple names, dates, venues, and timeline
export const coupleInfo = {
  bride: 'Your Name',
  groom: 'Partner Name',
  tagline: 'Your tagline here',
};

export const weddingDate = {
  date: '2024-06-15T16:00:00', // Local timezone (browser's timezone)
  // For specific timezone: use 'Z' for UTC or '-05:00' for EST, etc.
  displayDate: 'June 15, 2024',
};
// ... and more
```

**Timezone Handling:**
- The countdown timer uses the `date` field in ISO 8601 format
- Without timezone suffix (Z or offset), the date is interpreted in the browser's local timezone
- For UTC: use `'2024-06-15T16:00:00Z'`
- For specific timezone: use offset like `'2024-06-15T16:00:00-05:00'` (EST)
- This ensures all guests see the same countdown regardless of their location

### Adding Photos

Add your wedding photos to the gallery:

1. **Place photo files** in the `public/photos/` directory (create it if it doesn't exist)
2. **Update** `src/data/weddingData.js` `galleryPhotos` array with photo information:

```javascript
export const galleryPhotos = [
  {
    id: 1,
    src: '/photos/ceremony-1.jpg',       // Path relative to public directory
    alt: 'Ceremony moment',              // Descriptive alt text
    caption: 'Walking down the aisle',   // Optional caption
  },
  // Add more photos...
];
```

**Important - Vite Build Paths:**
- Photos must be placed in the `public/photos/` directory for production builds
- Use paths like `/photos/filename.jpg` (NOT `/src/assets/photos/filename.jpg`)
- Vite serves files from `public/` as-is without processing, ensuring they work in production
- The `public/photos/` directory may need to be created if it doesn't exist

**Alternative: Import-Based Approach**

If you prefer build-time processing and automatic asset hashing, you can import images from `src/assets/photos/`:

```javascript
import ceremony1 from '../assets/photos/ceremony-1.jpg';
import reception1 from '../assets/photos/reception-1.jpg';

export const galleryPhotos = [
  {
    id: 1,
    src: ceremony1,  // Vite will process and hash this URL
    alt: 'Ceremony moment',
    caption: 'Walking down the aisle',
  },
  {
    id: 2,
    src: reception1,
    alt: 'Reception celebration',
    caption: 'First dance',
  },
];
```

**Tradeoffs:**
- **`public/photos/`** (Recommended): Simpler, no imports needed, works immediately in production, but no automatic optimization or cache-busting
- **`src/assets/photos/`** (Alternative): Automatic optimization and versioned URLs, but requires importing each image

**Recommendations:**
- Use descriptive filenames (e.g., `ceremony-1.jpg`, `reception-dance.jpg`)
- Optimal image dimensions: **1200px width** for full-size images
- The `thumbnail` property is optional and will use `src` if not provided
- Optimize images before adding to reduce file size

### Design System

Customize colors and styling in `src/styles/variables.css`:

```css
:root {
  /* Update color palette */
  --color-primary: #f4e4e6;
  --color-rose-gold: #b76e79;
  /* ... and more variables */
}
```

### Layout

Modify component props in `src/App.jsx` to adjust layout and content.

## Google Maps Setup

To enable the interactive map in the Directions section:

1. Create a [Google Cloud project](https://console.cloud.google.com/)
2. Enable the **Maps Embed API**
3. Create an API key with appropriate restrictions
4. Create a `.env` file in the project root:

```bash
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
```

**Note:** The `.env` file is in `.gitignore` to keep your API key secure.

**Development without API key:** The DirectionsSection will show a fallback link to Google Maps if no API key is provided.

## Google Sheets Setup for Table Lookup

To enable guest table assignment lookup:

### Step 1: Create and Configure Your Google Sheet

1. Create a new Google Sheet or use an existing one
2. Set up columns with headers in the first row:
   - **Required:** First Name, Last Name, Full Name, Table
   - **Optional:** Guests, Notes
3. Example data format:

```
First Name | Last Name | Full Name    | Table | Guests
John       | Smith     | John Smith   | 5     | 2
Jane       | Doe       | Jane Doe     | 3     | 1
```

4. **Share the sheet:** File → Share → Change to "Anyone with the link" → Viewer access
5. **Copy the Spreadsheet ID** from the URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`

### Step 2: Enable Google Sheets API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or use existing (can be same as Maps API)
3. Enable the **Google Sheets API**
4. Create an API key (or use existing Maps API key)
5. **Restrict the key:**
   - **API restrictions:** Select "Google Sheets API"
   - **Application restrictions:** HTTP referrers (websites)
   - Add your domain(s): `https://yourusername.github.io/*` and `http://localhost:3000/*` for development

### Step 3: Configure Environment Variables

1. Copy `.env.example` to `.env` in project root
2. Add your API key:

```bash
VITE_GOOGLE_SHEETS_API_KEY=your_api_key_here
VITE_GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id_here
```

3. Alternatively, configure spreadsheet ID in `src/data/weddingData.js`:

```javascript
export const googleSheetsConfig = {
  spreadsheetId: 'your_spreadsheet_id_here',
  sheetRange: 'Guests!A1:E',
};
```

### Step 4: Customize Sheet Range (Optional)

- **Default range:** `Guests!A1:E` (sheet named "Guests", columns A-E)
- Adjust in `weddingData.js` if your sheet has different name or columns
- **Format:** `SheetName!StartCell:EndCell` (e.g., `GuestList!A1:F100`)

### Security Notes

- API keys are exposed in client-side code - always use restrictions
- Never use API keys with write permissions
- Sheet should be read-only (Viewer access only)
- For production, restrict to your specific domain
- The `.env` file is in `.gitignore` and won't be committed

### Troubleshooting

- **"API key not configured":** Check .env file exists and has correct variable name
- **"Failed to fetch data":** Verify sheet is shared publicly and API is enabled
- **"Invalid spreadsheet or range":** Check spreadsheet ID and sheet name are correct
- **"No data found":** Ensure sheet has data and range includes header row

## Features

### Implemented
- ✅ Elegant hero section with couple names and wedding date
- ✅ Real-time countdown timer to wedding day
- ✅ Interactive love story timeline
- ✅ Wedding details (ceremony, reception, dress code)
- ✅ Venue directions with Google Maps integration
- ✅ Photo gallery with responsive grid layout (1/2/3 columns based on screen size)
- ✅ Lightbox modal for full-size image viewing
- ✅ Keyboard navigation (arrow keys for prev/next, ESC to close, Home/End for first/last)
- ✅ Touch/swipe gestures for mobile navigation
- ✅ Native lazy loading for performance optimization
- ✅ Image captions support
- ✅ Responsive design for all devices
- ✅ Smooth scroll navigation with active link highlighting
- ✅ Accessibility features (ARIA labels, keyboard navigation, focus trapping)
- ✅ Scroll-based animations with IntersectionObserver
- ✅ Body scroll lock when lightbox is open
- ✅ Table assignment lookup with fuzzy name search
- ✅ Google Sheets API integration for guest data
- ✅ Flexible name matching (handles typos, partial names, case variations)
- ✅ Multiple match handling with selection interface
- ✅ Comprehensive error handling (API errors, network failures, missing data)
- ✅ Loading states with elegant animations
- ✅ Responsive search interface with elegant reveal animations
- ✅ Real-time data fetching from public Google Sheets

### Upcoming Features
- ⚡ Performance optimizations
- 🚀 Automated GitHub Pages deployment

## Gallery Usage

### Navigation Controls
- Click/tap thumbnail to open lightbox
- Use arrow keys or on-screen buttons to navigate between photos
- Swipe left/right on mobile devices
- Press ESC or click backdrop to close
- Home/End keys jump to first/last photo

### Customization Options

Customize the photo gallery through component props in `src/App.jsx`:

```javascript
<PhotoGallery
  photos={galleryPhotos}
  columns={{ mobile: 1, tablet: 2, desktop: 3, large: 4 }}  // Grid columns per breakpoint
  gap="xl"                                                   // Spacing: xs, sm, md, lg, xl, 2xl, 3xl
  showCaptions={false}                                       // Show captions on hover
/>
```

**Props:**
- `columns` - Object defining grid columns at each breakpoint (default: `{ mobile: 1, tablet: 2, desktop: 3, large: 4 }`)
- `gap` - Spacing between grid items using design system scale (default: `'xl'`)
- `showCaptions` - Show photo captions on thumbnails and in lightbox (default: `false`)

**CSS Customization:**
- Modify colors and transitions in `PhotoGallery.css` and `Lightbox.css`
- All styles use CSS variables from `src/styles/variables.css` for consistency
- Adjust animations, hover effects, and breakpoints as needed

## Table Lookup Usage

### How Guests Use It
1. Navigate to the "Find Your Table" section
2. Enter their name in the search box (first name, last name, or full name)
3. Click "Search" or press Enter
4. View their table assignment

### Search Features
- **Fuzzy matching:** handles typos and spelling variations
- **Partial names:** "John" will match "John Smith"
- **Case-insensitive:** "john smith" matches "John Smith"
- **Flexible format:** works with "First Last" or "Last, First"
- **Multiple matches:** if multiple guests match, shows selection list

### Customization

Customize the TableLookup component in `src/App.jsx`:

```javascript
<TableLookup
  spreadsheetId={googleSheetsConfig.spreadsheetId}
  sheetRange={googleSheetsConfig.sheetRange}
  title="Find Your Table"                    // Custom title
  subtitle="Enter your name..."              // Custom subtitle
  searchPlaceholder="Your name here..."      // Custom placeholder
  maxResults={5}                             // Max results for multiple matches
/>
```

### Data Management
- Update guest list directly in Google Sheets
- Changes are reflected immediately (no rebuild needed)
- Add/remove guests anytime
- Update table assignments as needed

## Technology Stack

- **React 19** - UI library
- **Vite 7** - Build tool and dev server
- **CSS Variables** - Design system
- **React Portal (createPortal)** - Modal rendering
- **Pointer Events API** - Touch gesture detection
- **Google Maps Embed API** - Venue directions
- **Google Sheets API v4** - Guest data management
- **Custom fuzzy search algorithm** - Flexible name matching with Levenshtein distance
- **CSS Grid & Flexbox** - Responsive layouts
- **IntersectionObserver API** - Scroll animations
- **Native lazy loading** - Image optimization
- **gh-pages** - GitHub Pages deployment

## Performance Notes

- Gallery uses native lazy loading (`loading="lazy"` attribute)
- Lightbox preloads adjacent images for smooth navigation
- CSS transforms used for GPU-accelerated animations
- Images should be optimized before adding to assets folder
- Google Sheets integration uses public API with read-only access
- Fuzzy search implemented without external dependencies for minimal bundle size

## Development Notes

- **Component Structure:** All components follow consistent patterns with separate CSS files
- **Styling:** Uses CSS variables from the design system for maintainability
- **Data Management:** Wedding data is centralized in `src/data/weddingData.js`
- **Modularity:** Components are reusable and accept props for customization
- **Accessibility:** ARIA labels, semantic HTML, keyboard navigation support
- **Google Sheets integration:** uses public API with read-only access
- **Fuzzy search:** implemented without external dependencies for minimal bundle size
- **Environment variables:** follow Vite conventions (VITE_ prefix)

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run deploy` - Deploy to GitHub Pages

## License

Private project for personal use.
