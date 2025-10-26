import { useState, useEffect, useRef } from 'react';
import Card from './ui/Card';
import './CountdownTimer.css';

function CountdownTimer({
  targetDate,
  showLabels = true,
  compact = false,
  onComplete,
}) {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const intervalRef = useRef(null);
  const onCompleteRef = useRef(onComplete);

  // Update onComplete ref when it changes
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    // Validate targetDate
    const target = new Date(targetDate);
    if (isNaN(target.getTime())) {
      setIsInvalid(true);
      return;
    }

    const calculateTimeRemaining = () => {
      const targetTime = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        setIsExpired(true);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        if (onCompleteRef.current) {
          onCompleteRef.current();
        }
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeRemaining({ days, hours, minutes, seconds });
    };

    calculateTimeRemaining();
    intervalRef.current = setInterval(calculateTimeRemaining, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [targetDate]);

  const formatNumber = (num) => String(num).padStart(2, '0');

  if (isInvalid) {
    return (
      <div className="countdown-timer">
        <div className="countdown-expired">
          <h2>Invalid Date</h2>
          <p>Please provide a valid wedding date.</p>
        </div>
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="countdown-timer">
        <div className="countdown-expired">
          <h2>The Big Day Is Here! 🎉</h2>
          <p>Congratulations on this special day!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`countdown-timer ${compact ? 'compact' : ''}`} aria-live="polite">
      <div className="countdown-grid">
        <div className="countdown-unit">
          <span className="countdown-value">{timeRemaining.days}</span>
          {showLabels && <span className="countdown-label">Days</span>}
        </div>
        <div className="countdown-unit">
          <span className="countdown-value">{formatNumber(timeRemaining.hours)}</span>
          {showLabels && <span className="countdown-label">Hours</span>}
        </div>
        <div className="countdown-unit">
          <span className="countdown-value">{formatNumber(timeRemaining.minutes)}</span>
          {showLabels && <span className="countdown-label">Minutes</span>}
        </div>
        <div className="countdown-unit">
          <span className="countdown-value">{formatNumber(timeRemaining.seconds)}</span>
          {showLabels && <span className="countdown-label">Seconds</span>}
        </div>
      </div>
    </div>
  );
}

export default CountdownTimer;
