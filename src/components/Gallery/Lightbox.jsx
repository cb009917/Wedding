import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { acquireLock, releaseLock } from '../../utils/scrollLock';
import './Lightbox.css';

function Lightbox({
  photos,
  currentIndex,
  onClose,
  onNavigate,
  showCaptions = true,
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const lightboxRef = useRef(null);
  const previousFocusRef = useRef(null);

  // Effect 1 - Body Scroll Lock and Focus Management
  useEffect(() => {
    // Store currently focused element
    previousFocusRef.current = document.activeElement;

    // Acquire scroll lock using reference-counted utility
    acquireLock('lightbox');

    // Focus the lightbox container
    if (lightboxRef.current) {
      lightboxRef.current.focus();
    }

    // Cleanup
    return () => {
      releaseLock('lightbox');
      // Restore focus to previous element
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, []);

  // Effect 2 - Consolidated Keyboard Handling (Focus Trap + Navigation)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxRef.current) return;

      // First enforce focus trap for Tab key
      if (e.key === 'Tab') {
        const focusableElements = lightboxRef.current.querySelectorAll(
          'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        // Guard against zero focusable elements
        if (focusableElements.length === 0) {
          e.preventDefault();
          lightboxRef.current.focus();
          e.stopPropagation();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
          e.stopPropagation();
          return;
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
          e.stopPropagation();
          return;
        }
      }

      // Then process navigation keys
      switch (e.key) {
        case 'Escape':
          onClose();
          e.stopPropagation();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          goToPrevious();
          e.stopPropagation();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goToNext();
          e.stopPropagation();
          break;
        case 'Home':
          e.preventDefault();
          onNavigate(0);
          e.stopPropagation();
          break;
        case 'End':
          e.preventDefault();
          onNavigate(photos.length - 1);
          e.stopPropagation();
          break;
        default:
          break;
      }
    };

    // Attach to lightboxRef to prevent event propagation
    if (lightboxRef.current) {
      lightboxRef.current.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      if (lightboxRef.current) {
        lightboxRef.current.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [currentIndex, photos.length, onClose, onNavigate]);

  // Effect 4 - Image Loading and Preloading
  useEffect(() => {
    setImageLoaded(false);

    // Preload next and previous images
    const preloadImage = (index) => {
      if (index >= 0 && index < photos.length) {
        const img = new Image();
        img.src = photos[index].src;
      }
    };

    // Preload adjacent images
    const nextIndex = (currentIndex + 1) % photos.length;
    const prevIndex = (currentIndex - 1 + photos.length) % photos.length;
    preloadImage(nextIndex);
    preloadImage(prevIndex);
  }, [currentIndex, photos]);

  // Navigation Functions
  const goToPrevious = () => {
    const prevIndex = (currentIndex - 1 + photos.length) % photos.length;
    onNavigate(prevIndex);
  };

  const goToNext = () => {
    const nextIndex = (currentIndex + 1) % photos.length;
    onNavigate(nextIndex);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  // Touch/Pointer Gesture Handlers
  const handlePointerDown = (e) => {
    setTouchStart({
      x: e.clientX,
      y: e.clientY,
      time: Date.now(),
    });
  };

  const handlePointerUp = (e) => {
    if (!touchStart) return;

    const deltaX = e.clientX - touchStart.x;
    const deltaY = e.clientY - touchStart.y;
    const deltaTime = Date.now() - touchStart.time;

    // Calculate if it's a horizontal swipe
    const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);
    const swipeThreshold = 50;
    const velocity = Math.abs(deltaX) / deltaTime;

    if (isHorizontalSwipe && Math.abs(deltaX) > swipeThreshold && velocity > 0.3) {
      if (deltaX > 0) {
        // Swipe right - go to previous
        goToPrevious();
      } else {
        // Swipe left - go to next
        goToNext();
      }
    }

    setTouchStart(null);
  };

  const handlePointerCancel = () => {
    setTouchStart(null);
  };

  const handlePointerLeave = () => {
    setTouchStart(null);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const currentPhoto = photos[currentIndex];
  const isOnlyPhoto = photos.length === 1;

  const lightboxContent = (
    <div className="lightbox-backdrop" onClick={handleBackdropClick}>
      <div
        className="lightbox-container"
        ref={lightboxRef}
        role="dialog"
        aria-modal="true"
        aria-label="Photo gallery lightbox"
        tabIndex={-1}
      >
        {/* Close Button */}
        <button
          className="lightbox-close"
          onClick={onClose}
          aria-label="Close gallery"
        >
          ✕
        </button>

        {/* Image Container */}
        <div className="lightbox-image-container">
          {!imageLoaded && (
            <div className="lightbox-loading">
              <div className="map-spinner" aria-label="Loading image..."></div>
            </div>
          )}
          <img
            src={currentPhoto.src}
            alt={currentPhoto.alt}
            className="lightbox-image"
            onLoad={handleImageLoad}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            onPointerLeave={handlePointerLeave}
            style={{ opacity: imageLoaded ? 1 : 0 }}
          />
        </div>

        {/* Caption */}
        {showCaptions && currentPhoto.caption && (
          <div className="lightbox-caption">{currentPhoto.caption}</div>
        )}

        {/* Navigation Buttons */}
        {!isOnlyPhoto && (
          <>
            <button
              className="lightbox-nav-button lightbox-nav-prev"
              onClick={goToPrevious}
              aria-label="Previous photo"
            >
              ←
            </button>
            <button
              className="lightbox-nav-button lightbox-nav-next"
              onClick={goToNext}
              aria-label="Next photo"
            >
              →
            </button>
          </>
        )}

        {/* Photo Counter */}
        <div className="lightbox-counter">
          {currentIndex + 1} of {photos.length}
        </div>

        {/* Keyboard Hint */}
        <div className="lightbox-hint">
          Use arrow keys to navigate, ESC to close
        </div>
      </div>
    </div>
  );

  return createPortal(lightboxContent, document.body);
}

export default Lightbox;
