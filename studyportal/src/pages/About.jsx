import { useState } from 'react';
import { Button, Card } from 'gdg-ui';

const gdgPillars = [
  { emoji: "🤝", title: "Connect", description: "Meet local developers..." },
  { emoji: "📚", title: "Learn",   description: "Hands-on workshops..." },
  { emoji: "🚀", title: "Grow",    description: "Apply new knowledge..." },
];

export default function About() {
  const [likes, setLikes] = useState(0); // pre-wired example
  
  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ textAlign: 'center', fontSize: '3rem' }}>About GDG</h1>
      
      <div style={{ textAlign: 'center', margin: '2rem 0' }}>
        <Button onClick={() => setLikes(likes + 1)}>
          ❤️ Like this page ({likes})
        </Button>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '2rem',
        marginTop: '3rem'
      }}>
        {/* ✅ TASK: Map over gdgPillars and render your FeatureCard component */}
        {/* Pass 'emoji', 'title', and 'description' as PROPS! */}
        
        {/* Placeholder for students to fill */}
        <p style={{ color: '#94a3b8' }}>Build your FeatureCard component and map it here!</p>
      </div>
    </div>
  );
}

// ✅ TASK: Build a FeatureCard component that accepts PROPS:
function FeatureCard({ emoji, title, description }) {
    // 1. Receive props
    // 2. Return a <Card> (from gdg-ui) using those props
}
