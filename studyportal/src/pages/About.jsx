import { useState } from 'react';

const gdgPillars = [
  { emoji: "🤝", title: "Connect", description: "Meet local developers..." },
  { emoji: "📚", title: "Learn",   description: "Participate in hands-on workshops..." },
  { emoji: "🚀", title: "Grow",    description: "Advance your career..." },
];

export default function About() {
  return (
    <div style={{ padding: '4rem 2rem' }}>
      <h1 style={{ textAlign: 'center' }}>About the Workshop</h1>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '2rem',
        marginTop: '3rem'
      }}>
        {/* ✅ TASK: Map over gdgPillars and render a FeatureCard */}
        {gdgPillars.map((p, i) => (
           <div key={i} style={{ padding: '1.5rem', border: '1px solid #334155', borderRadius: '12px' }}>
              <h3>{p.emoji} {p.title}</h3>
              <p style={{ color: '#94a3b8' }}>{p.description}</p>
           </div>
        ))}
      </div>
    </div>
  );
}

// ✅ TASK: Convert the div above into a reusable Component with Props!
