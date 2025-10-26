import { useState } from 'react';
import Lightbox from './Lightbox';
import Section from '../ui/Section';
import './PhotoGallery.css';

function PhotoGallery({
  photos = [],
  columns = { mobile: 1, tablet: 2, desktop: 3, large: 4 },
  gap = 'xl',
  showCaptions = false,
}) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const openLightbox = (index) => {
    setSelectedPhotoIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setSelectedPhotoIndex(null);
    setIsLightboxOpen(false);
  };

  const navigateToPhoto = (index) => {
    setSelectedPhotoIndex(index);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openLightbox(index);
    }
  };

  // Compute CSS custom properties for grid
  const gridStyle = {
    '--gallery-columns-mobile': columns.mobile,
    '--gallery-columns-tablet': columns.tablet,
    '--gallery-columns-desktop': columns.desktop,
    '--gallery-columns-large': columns.large,
    '--gallery-gap': `var(--spacing-${gap})`,
  };

  return (
    <Section id="photos" background="white" padding="large">
      <div className="gallery-header">
        <h2>Our Special Moments</h2>
        <p className="gallery-subtitle">
          Captured memories from our special day
        </p>
      </div>

      <div className="gallery-grid" role="list" style={gridStyle}>
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            className="gallery-item"
            role="button"
            onClick={() => openLightbox(index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            tabIndex={0}
            aria-label={`View photo: ${photo.alt}`}
          >
            <img
              src={photo.thumbnail || photo.src}
              alt={photo.alt}
              loading="lazy"
              className="gallery-image"
            />
            {showCaptions && photo.caption && (
              <div className="gallery-caption">{photo.caption}</div>
            )}
          </button>
        ))}
      </div>

      {isLightboxOpen && selectedPhotoIndex !== null && (
        <Lightbox
          photos={photos}
          currentIndex={selectedPhotoIndex}
          onClose={closeLightbox}
          onNavigate={navigateToPhoto}
          showCaptions={showCaptions}
        />
      )}
    </Section>
  );
}

export default PhotoGallery;
