import { useState } from 'react';
import { Button, Card } from 'gdg-ui';

export default function Quiz() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    console.log("Will call Gemini with:", topic);
    // Day 3: This becomes the actual API call
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center' }}>AI Quiz Portal</h1>
      <p style={{ textAlign: 'center', color: '#94a3b8' }}>Generate a quiz on any topic in seconds.</p>

      <Card style={{ marginTop: '3rem' }}>
        <h3>What do you want to learn today?</h3>
        <textarea 
          placeholder="e.g. React Hooks, Network Protocols, or History of Rome..."
          style={{ 
            width: '100%', 
            background: 'rgba(255,255,255,0.05)', 
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            padding: '1rem',
            color: 'white',
            minHeight: '120px',
            fontSize: '1rem',
            marginBottom: '1rem'
          }}
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        />
        <Button onClick={handleGenerate} style={{ width: '100%' }}>
          Generate Quiz 🚀
        </Button>
      </Card>
      
      {/* Day 3 Checkpoint: Results and Questions go here */}
    </div>
  );
}
