import Section from './ui/Section';
import Card from './ui/Card';
import './StorySection.css';

function StorySection({
  story = {
    introduction:
      "Every love story is beautiful, but ours is our favorite. Here's how our journey began and led us to this special day.",
    timeline: [
      {
        date: '2018-03-15',
        title: 'First Met',
        description:
          'We met at a coffee shop on a rainy spring morning. What started as a casual conversation turned into hours of laughter and connection.',
      },
      {
        date: '2018-06-20',
        title: 'First Date',
        description:
          'Our first official date was a picnic in the park. Under the summer sun, we realized this was the beginning of something special.',
      },
      {
        date: '2020-12-24',
        title: 'Engagement',
        description:
          'James proposed on Christmas Eve under the stars. With tears of joy and an overwhelming "yes," we began planning our forever.',
      },
      {
        date: '2024-06-15',
        title: 'Wedding Day',
        description:
          'The day we say "I do" and begin our forever together, surrounded by the love and support of our family and friends.',
      },
    ],
  },
  layout = 'timeline',
}) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString; // Return original string if invalid
    }
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  return (
    <Section id="story" background="white" padding="large">
      <div className="story-header">
        <h2>Our Story</h2>
      </div>

      {story.introduction && (
        <p className="story-intro">{story.introduction}</p>
      )}

      {layout === 'timeline' ? (
        <div className="story-timeline">
          <div className="timeline-line"></div>
          <ol className="timeline-items">
            {story.timeline.map((event, index) => (
              <li key={index} className="timeline-item">
                <div className="timeline-date">
                  <time dateTime={event.date}>{formatDate(event.date)}</time>
                </div>
                <Card variant="elevated" padding="medium" className="timeline-content">
                  <h3 className="timeline-title">{event.title}</h3>
                  <p className="timeline-description">{event.description}</p>
                </Card>
              </li>
            ))}
          </ol>
        </div>
      ) : (
        <div className="story-narrative">
          {story.timeline.map((event, index) => (
            <Card key={index} variant="elevated" padding="large" className="narrative-item">
              <time dateTime={event.date} className="narrative-date">
                {formatDate(event.date)}
              </time>
              <h3 className="narrative-title">{event.title}</h3>
              <p className="narrative-description">{event.description}</p>
            </Card>
          ))}
        </div>
      )}
    </Section>
  );
}

export default StorySection;
