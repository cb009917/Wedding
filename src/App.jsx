import { lazy, Suspense } from 'react';
import Layout from './components/Layout/Layout';
import { Section } from './components/ui';
import LoadingFallback from './components/LoadingFallback';
import ErrorBoundary from './components/ErrorBoundary';
import HeroSection from './components/HeroSection'; // Direct import for better LCP
import {
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
} from './data/weddingData';

// Lazy load components for code splitting (Hero is imported directly above)
const WeddingDetails = lazy(() => import('./components/WeddingDetails'));
const StorySection = lazy(() => import('./components/StorySection'));
const CountdownTimer = lazy(() => import('./components/CountdownTimer'));
const DirectionsSection = lazy(() => import('./components/DirectionsSection'));
const PhotoGallery = lazy(() => import('./components/Gallery/PhotoGallery'));
const TableLookup = lazy(() => import('./components/TableLookup/TableLookup'));

function App() {
  return (
    <Layout>
      {/* Hero Section - Direct render for better LCP */}
      <HeroSection
        coupleNames={{ bride: coupleInfo.bride, groom: coupleInfo.groom }}
        weddingDate={weddingDate.displayDate}
        tagline={coupleInfo.tagline}
      />

      {/* Countdown Timer Section */}
      <Suspense fallback={<LoadingFallback />}>
        <Section id="countdown" background="accent" padding="medium">
          <CountdownTimer targetDate={weddingDate.date} />
        </Section>
      </Suspense>

      {/* Story Section */}
      <Suspense fallback={<LoadingFallback />}>
        <StorySection
          story={{
            introduction: storyIntroduction,
            timeline: storyTimeline,
          }}
        />
      </Suspense>

      {/* Wedding Details Section */}
      <Suspense fallback={<LoadingFallback />}>
        <WeddingDetails
          ceremony={ceremonyDetails}
          reception={receptionDetails}
          dressCode={dressCode}
        />
      </Suspense>

      {/* Directions Section */}
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <DirectionsSection
            venue={venueLocation}
            coordinates={venueLocation.coordinates}
            additionalInfo={venueLocation.additionalInfo}
          />
        </Suspense>
      </ErrorBoundary>

      {/* Photos Section */}
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <PhotoGallery photos={galleryPhotos} />
        </Suspense>
      </ErrorBoundary>

      {/* Table Lookup Section */}
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <TableLookup
            spreadsheetId={googleSheetsConfig.spreadsheetId}
            sheetRange={googleSheetsConfig.sheetRange}
          />
        </Suspense>
      </ErrorBoundary>
    </Layout>
  );
}

export default App;
