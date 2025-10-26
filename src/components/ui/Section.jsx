import { useEffect, useRef } from 'react';
import './Section.css';

function Section({
  children,
  id,
  className = '',
  background = 'white',
  padding = 'large',
  container = true,
  animate = true,
}) {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!animate || !sectionRef.current) return;

    // Fallback for browsers without IntersectionObserver
    if (!('IntersectionObserver' in window)) {
      sectionRef.current.classList.add('visible');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, [animate]);

  const classes = [
    'section',
    `section-bg-${background}`,
    `section-padding-${padding}`,
    animate ? 'animate-on-scroll' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = container ? (
    <div className="section-container">{children}</div>
  ) : (
    children
  );

  return (
    <section id={id} className={classes} ref={sectionRef}>
      {content}
    </section>
  );
}

export default Section;
