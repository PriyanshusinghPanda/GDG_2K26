// About.jsx — Information page demonstrating the use of props and mapping over arrays
import { useState, useEffect } from 'react';
import Card from '../components/Card';
import './About.css';

// Data array defined outside the component
const gdgInfo = [
  {
    id: 1,
    title: "Connect",
    description: "Meet local developers and technologists. All are welcome, including those with diverse backgrounds and from various companies and industries.",
    emoji: "🤝"
  },
  {
    id: 2,
    title: "Learn",
    description: "Learn about a range of technical topics and gain new skills through hands-on workshops, training, events, talks, and meetups.",
    emoji: "📚"
  },
  {
    id: 3,
    title: "Grow",
    description: "Apply new knowledge and connections to build great products, advance your career, network, and grow your professional profile.",
    emoji: "🚀"
  }
];

function About() {
  // useState example for students to write (2nd place)
  const [likes, setLikes] = useState(0);

  // useEffect usage to verify document title understanding for students
  useEffect(() => {
    document.title = "About | StudyPortal";
  }, []);

  return (
    <div className="about-container">
      <h1 className="about-title">About GDG</h1>
      <p className="about-subtitle">
        Google Developer Groups (GDG) is a community-driven initiative for developers.
      </p>
      
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <button onClick={() => setLikes(likes + 1)}>
          ❤️ Like this page ({likes})
        </button>
      </div>

      <div className="cards-grid">
        {/* Map through the gdgInfo array to dynamically render Card components */}
        {gdgInfo.map((info) => (
          // The key prop is required by React to efficiently identify and track which items changed, are added, or are removed
          <Card 
            key={info.id}
            title={info.title} 
            description={info.description}
            emoji={info.emoji}
          />
        ))}
      </div>
    </div>
  );
}

export default About;
