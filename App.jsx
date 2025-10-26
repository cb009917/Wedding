import Layout from './src/components/Layout/Layout';
import { Section, Button, Card } from './src/components/ui';

function App() {
  return (
    <Layout>
      {/* Hero Section */}
      <Section id="home" background="light" padding="large">
        <div className="text-center">
          <h1>Anna & James</h1>
          <p style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-md)' }}>
            June 15, 2024
          </p>
          <p style={{ marginTop: 'var(--spacing-xl)', marginBottom: 'var(--spacing-xl)' }}>
            Join us as we celebrate our special day
          </p>
          <Button variant="primary" size="large">
            View Details
          </Button>
        </div>
      </Section>

      {/* Story Section */}
      <Section id="story" background="white" padding="large">
        <div className="text-center">
          <h2>Our Story</h2>
          <p style={{ maxWidth: '800px', margin: '0 auto' }}>
            Every love story is beautiful, but ours is our favorite. We're excited to share this special journey with you
            and celebrate the beginning of our forever together.
          </p>
        </div>
      </Section>

      {/* Details Section */}
      <Section id="details" background="accent" padding="large">
        <div className="text-center" style={{ marginBottom: 'var(--spacing-3xl)' }}>
          <h2>Wedding Details</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--spacing-xl)' }}>
          <Card variant="elevated" padding="large" hover>
            <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Ceremony</h3>
            <p>June 15, 2024</p>
            <p>4:00 PM</p>
            <p>Garden Venue</p>
          </Card>
          <Card variant="elevated" padding="large" hover>
            <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Reception</h3>
            <p>June 15, 2024</p>
            <p>6:00 PM</p>
            <p>Ballroom Hall</p>
          </Card>
          <Card variant="elevated" padding="large" hover>
            <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Dress Code</h3>
            <p>Formal Attire</p>
            <p>Romantic & Elegant</p>
          </Card>
        </div>
      </Section>

      {/* Photos Section */}
      <Section id="photos" background="white" padding="large">
        <div className="text-center">
          <h2>Photos</h2>
          <p>Photo gallery coming soon...</p>
          <div style={{ marginTop: 'var(--spacing-xl)' }}>
            <Button variant="outline">View Gallery</Button>
          </div>
        </div>
      </Section>

      {/* Table Lookup Section */}
      <Section id="table-lookup" background="light" padding="large">
        <div className="text-center">
          <h2>Find Your Table</h2>
          <p style={{ marginBottom: 'var(--spacing-xl)' }}>
            Enter your name to find your table assignment
          </p>
          <Card variant="elevated" padding="large" style={{ maxWidth: '500px', margin: '0 auto' }}>
            <p>Table lookup feature coming soon...</p>
            <div style={{ marginTop: 'var(--spacing-lg)' }}>
              <Button variant="primary" fullWidth>
                Search
              </Button>
            </div>
          </Card>
        </div>
      </Section>
    </Layout>
  );
}

export default App;
