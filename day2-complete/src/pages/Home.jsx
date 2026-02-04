import { useState } from 'react';
import { Button } from 'gdg-ui';

// 🏠 HOME PAGE — LIVE BUILD STARTER
export default function Home() {
  const [showDemo, setShowDemo] = useState(false); 

  return (
    <div style={{ padding: '2rem' }}>
      {/* Passing data as Props */}
      <Hero 
        title="Welcome to StudyPortal" 
        subtitle="The easiest way to generate smart quizzes from your study notes." 
      />
      
      <div style={{ marginTop: '3rem', textAlign: 'center' }}>
        <Button onClick={() => setShowDemo(!showDemo)}>
          {showDemo ? 'Hide State Demo' : 'Show State Demo'}
        </Button>
      </div>

      {showDemo && <StateDemo />}
    </div>
  );
}

// Sub-component: Hero
function Hero({ title, subtitle }) {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 0' }}>
      <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>{title}</h1>
      <p style={{ fontSize: '1.2rem', color: '#94a3b8' }}>{subtitle}</p>
    </div>
  );
}

// Sub-component: StateDemo
function StateDemo() {
  return (
    <div style={{ marginTop: '2rem', padding: '2rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
      <h2>This is React State!</h2>
      <p>I only appear when 'showDemo' is true. That's conditional rendering.</p>
    </div>
  );
}
