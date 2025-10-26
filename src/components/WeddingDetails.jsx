import Section from './ui/Section';
import Card from './ui/Card';
import './WeddingDetails.css';

function WeddingDetails({
  ceremony = {
    date: 'June 15, 2024',
    time: '4:00 PM',
    venue: 'Garden Venue',
    address: '123 Garden Lane',
  },
  reception = {
    date: 'June 15, 2024',
    time: '6:00 PM',
    venue: 'Ballroom Hall',
    address: '456 Celebration Ave',
  },
  dressCode = {
    title: 'Formal Attire',
    description: 'Romantic & Elegant',
    notes: 'Optional: Blush and gold tones encouraged',
  },
  additionalInfo = [],
  showDirectionsLink = true,
}) {
  const handleScrollToDirections = (e) => {
    e.preventDefault();
    const directionsSection = document.getElementById('directions');
    if (directionsSection) {
      directionsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <Section id="details" background="accent" padding="large">
      <div className="details-header">
        <h2>Wedding Details</h2>
      </div>

      <div className="details-grid">
        {/* Ceremony Card */}
        <Card variant="elevated" padding="large" hover className="detail-card">
          <div className="detail-icon" aria-hidden="true">
            💍
          </div>
          <h3 className="detail-title">Ceremony</h3>
          <div className="detail-info">
            <p className="detail-date">📅 {ceremony.date}</p>
            <p className="detail-time">🕐 {ceremony.time}</p>
          </div>
          <p className="detail-venue">{ceremony.venue}</p>
          <p className="detail-address">{ceremony.address}</p>
          {showDirectionsLink && (
            <a
              href="#directions"
              className="detail-link"
              onClick={handleScrollToDirections}
            >
              Get Directions →
            </a>
          )}
        </Card>

        {/* Reception Card */}
        <Card variant="elevated" padding="large" hover className="detail-card">
          <div className="detail-icon" aria-hidden="true">
            🥂
          </div>
          <h3 className="detail-title">Reception</h3>
          <div className="detail-info">
            <p className="detail-date">📅 {reception.date}</p>
            <p className="detail-time">🕐 {reception.time}</p>
          </div>
          <p className="detail-venue">{reception.venue}</p>
          <p className="detail-address">{reception.address}</p>
          {showDirectionsLink && (
            <a
              href="#directions"
              className="detail-link"
              onClick={handleScrollToDirections}
            >
              Get Directions →
            </a>
          )}
        </Card>

        {/* Dress Code Card */}
        <Card variant="elevated" padding="large" hover className="detail-card">
          <div className="detail-icon" aria-hidden="true">
            👔
          </div>
          <h3 className="detail-title">Dress Code</h3>
          <div className="detail-info">
            <p className="detail-venue">{dressCode.title}</p>
            <p className="detail-description">{dressCode.description}</p>
          </div>
          {dressCode.notes && (
            <p className="detail-address">{dressCode.notes}</p>
          )}
        </Card>
      </div>

      {/* Additional Info */}
      {additionalInfo.length > 0 && (
        <div className="details-additional">
          {additionalInfo.map((info, index) => (
            <Card key={index} variant="outlined" padding="medium">
              <h4>{info.title}</h4>
              <p>{info.description}</p>
            </Card>
          ))}
        </div>
      )}
    </Section>
  );
}

export default WeddingDetails;
