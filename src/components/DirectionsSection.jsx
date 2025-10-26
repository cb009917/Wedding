import { useState } from 'react';
import Section from './ui/Section';
import Card from './ui/Card';
import Button from './ui/Button';
import './DirectionsSection.css';

function DirectionsSection({
  venue = {
    name: 'Garden Venue',
    address: '123 Garden Lane',
    city: 'Springfield',
    state: 'IL',
    zip: '62701',
    country: 'USA',
  },
  coordinates = { lat: 39.7817, lng: -89.6501 },
  mapZoom = 15,
  showDirectionsButton = true,
  additionalInfo = 'Free parking available. Venue is wheelchair accessible.',
}) {
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const fullAddress = `${venue.address}, ${venue.city}, ${venue.state} ${venue.zip}`;
  const encodedAddress = encodeURIComponent(fullAddress);

  // Check if coordinates are valid
  const hasValidCoordinates =
    coordinates &&
    typeof coordinates.lat === 'number' &&
    typeof coordinates.lng === 'number' &&
    !isNaN(coordinates.lat) &&
    !isNaN(coordinates.lng);

  // Build URLs based on whether coordinates are available
  const googleMapsDirectionsUrl = hasValidCoordinates
    ? `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`
    : `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;

  // Note: Google Maps API key should be stored in environment variable
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const mapEmbedUrl =
    apiKey && hasValidCoordinates
      ? `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${coordinates.lat},${coordinates.lng}&zoom=${mapZoom}`
      : apiKey
      ? `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodedAddress}&zoom=${mapZoom}`
      : null;

  return (
    <Section id="directions" background="white" padding="large">
      <div className="directions-header">
        <h2>Directions & Location</h2>
      </div>

      <div className="directions-container">
        {/* Venue Information Card */}
        <div className="directions-info">
          <Card variant="elevated" padding="large">
            <h3 className="venue-name">{venue.name}</h3>

            <address className="venue-address">
              <span className="address-icon" aria-hidden="true">
                📍
              </span>
              <div className="address-text">
                {venue.address}
                <br />
                {venue.city}, {venue.state} {venue.zip}
                <br />
                {venue.country}
              </div>
            </address>

            {showDirectionsButton && (
              <div className="directions-button">
                <Button
                  variant="primary"
                  onClick={() =>
                    window.open(googleMapsDirectionsUrl, '_blank', 'noopener,noreferrer')
                  }
                >
                  Get Directions
                </Button>
              </div>
            )}

            {additionalInfo && (
              <div className="directions-additional">
                <p>{additionalInfo}</p>
              </div>
            )}
          </Card>
        </div>

        {/* Google Maps Embed */}
        <div className="directions-map">
          {mapEmbedUrl ? (
            <>
              {!isMapLoaded && (
                <div className="map-loading">
                  <div className="map-spinner" aria-label="Loading map..."></div>
                </div>
              )}
              <iframe
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps showing venue location"
                onLoad={() => setIsMapLoaded(true)}
              />
            </>
          ) : (
            <div className="map-fallback">
              <p>Map not available</p>
              <Button
                variant="outline"
                onClick={() =>
                  window.open(googleMapsDirectionsUrl, '_blank', 'noopener,noreferrer')
                }
              >
                Open in Google Maps
              </Button>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}

export default DirectionsSection;
