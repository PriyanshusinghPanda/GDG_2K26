import { useState } from 'react';
import { Button, Card, Grid, Container } from 'gdg-ui';

const gdgPillars = [
  { emoji: "🤝", title: "Connect", description: "Meet local developers and learn about the Google developer ecosystem." },
  { emoji: "📚", title: "Learn",   description: "Participate in hands-on workshops and technical talks." },
  { emoji: "🚀", title: "Grow",    description: "Apply your knowledge to build real projects and advance your career." },
];

export default function About() {
  const [likes, setLikes] = useState(0); 
  
  return (
    <Container style={{ padding: '4rem 0' }}>
      <h1 style={{ textAlign: 'center', fontSize: '3.5rem', marginBottom: '1rem' }}>About GDG</h1>
      <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '1.2rem', marginBottom: '3rem' }}>
        Empowering developers to build together.
      </p>
      
      <div style={{ textAlign: 'center', margin: '2rem 0' }}>
        <Button onClick={() => setLikes(likes + 1)}>
          ❤️ Like this page ({likes})
        </Button>
      </div>

      <Grid>
        {gdgPillars.map((pillar, index) => (
          <FeatureCard 
            key={index}
            emoji={pillar.emoji}
            title={pillar.title}
            description={pillar.description}
          />
        ))}
      </Grid>
    </Container>
  );
}

function FeatureCard({ emoji, title, description }) {
    return (
        <Card emoji={emoji} title={title}>
            <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>{description}</p>
        </Card>
    );
}
