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

- **`src/components/`** - Reusable React components (table cards, guest lists, etc.)
- **`src/assets/`** - Static assets (images, fonts, icons)
- **`src/styles/`** - CSS and styling files
- **`src/utils/`** - Utility functions and helper modules

## Google Sheets Integration

*To be implemented:* This project will integrate with Google Sheets to manage guest and table data dynamically.

### Planned Features

- Fetch table assignments from Google Sheets
- Real-time updates when data changes
- Searchable guest directory
- Responsive table layout

Setup instructions and API configuration will be added once the integration is implemented.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run deploy` - Deploy to GitHub Pages

## License

Private project for personal use.
