import Section from './ui/Section';
import Button from './ui/Button';
import './HeroSection.css';

function HeroSection({
  coupleNames = { bride: 'Anna', groom: 'James' },
  weddingDate = 'June 15, 2024',
  tagline = 'Join us as we celebrate our special day',
  showScrollIndicator = true,
}) {
  const handleViewDetails = () => {
    document.getElementById('details')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Section id="home" background="light" padding="large">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-names animate-fade-in-up">
            {coupleNames.bride} <span className="hero-ampersand">&</span>{' '}
            {coupleNames.groom}
          </h1>

          <p className="hero-date animate-fade-in-up animate-delay-200">
            {weddingDate}
          </p>

          <p className="hero-tagline animate-fade-in-up animate-delay-300">
            {tagline}
          </p>

          <div className="hero-cta animate-fade-in-up animate-delay-400">
            <Button variant="primary" size="large" onClick={handleViewDetails}>
              View Details
            </Button>
          </div>
        </div>

        {showScrollIndicator && (
          <div className="hero-scroll-indicator animate-float">
            <span className="scroll-text">Scroll to explore</span>
            <span className="scroll-arrow">↓</span>
          </div>
        )}
      </div>
    </Section>
  );
}

export default HeroSection;
