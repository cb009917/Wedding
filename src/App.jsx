import Layout from './components/Layout/Layout';
import { Section } from './components/ui';
import HeroSection from './components/HeroSection';
import WeddingDetails from './components/WeddingDetails';
import StorySection from './components/StorySection';
import CountdownTimer from './components/CountdownTimer';
import DirectionsSection from './components/DirectionsSection';
import PhotoGallery from './components/Gallery/PhotoGallery';
import TableLookup from './components/TableLookup/TableLookup';
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

function App() {
  return (
    <Layout>
      {/* Hero Section */}
      <HeroSection
        coupleNames={{ bride: coupleInfo.bride, groom: coupleInfo.groom }}
        weddingDate={weddingDate.displayDate}
        tagline={coupleInfo.tagline}
      />

      {/* Countdown Timer Section */}
      <Section id="countdown" background="accent" padding="medium">
        <CountdownTimer targetDate={weddingDate.date} />
      </Section>

      {/* Story Section */}
      <StorySection
        story={{
          introduction: storyIntroduction,
          timeline: storyTimeline,
        }}
      />

      {/* Wedding Details Section */}
      <WeddingDetails
        ceremony={ceremonyDetails}
        reception={receptionDetails}
        dressCode={dressCode}
      />

      {/* Directions Section */}
      <DirectionsSection
        venue={venueLocation}
        coordinates={venueLocation.coordinates}
        additionalInfo={venueLocation.additionalInfo}
      />

      {/* Photos Section */}
      <PhotoGallery photos={galleryPhotos} />

      {/* Table Lookup Section */}
      <TableLookup
        spreadsheetId={googleSheetsConfig.spreadsheetId}
        sheetRange={googleSheetsConfig.sheetRange}
      />
    </Layout>
  );
}

export default App;
