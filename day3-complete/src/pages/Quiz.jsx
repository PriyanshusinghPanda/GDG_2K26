import { useState } from 'react';
import { Button, Card } from 'gdg-ui';
import { generateQuizQuestions } from '../lib/gemini';

export default function Quiz() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState(null);
  const [error, setError] = useState("");
  
  // Game State
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    
    setLoading(true);
    setError("");
    setQuestions(null);
    setCurrentIdx(0);
    setScore(0);
    setIsFinished(false);

    try {
      const data = await generateQuizQuestions(topic);
      setQuestions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (selectedOption) => {
    const currentQ = questions[currentIdx];
    if (selectedOption === currentQ.answer) {
      setScore(score + 1);
    }
    
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setIsFinished(true);
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center' }}>AI Quiz Portal</h1>
      <p style={{ textAlign: 'center', color: '#94a3b8' }}>Generate a quiz on any topic in seconds.</p>

      {/* 1. Setup Phase: Asking for topic */}
      {!questions && !loading && (
        <Card style={{ marginTop: '3rem' }}>
          <h3>What do you want to learn today?</h3>
          <textarea 
            placeholder="e.g. React Hooks, Network Protocols, or History of Rome..."
            style={{ 
              width: '100%', background: 'rgba(255,255,255,0.05)', 
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px',
              padding: '1rem', color: 'white', minHeight: '120px', fontSize: '1rem',
              marginBottom: '1rem', marginTop: '1rem'
            }}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <Button onClick={handleGenerate} style={{ width: '100%' }}>
            Generate Quiz 🚀
          </Button>
          {error && <p style={{ color: '#ef4444', marginTop: '1rem' }}>{error}</p>}
        </Card>
      )}

      {/* 2. Loading Phase */}
      {loading && (
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <h2 style={{ color: 'cyan' }}>✨ Gemini is thinking...</h2>
          <p style={{ color: '#94a3b8' }}>Crafting questions about "{topic}"</p>
        </div>
      )}

      {/* 3. Playing Phase */}
      {questions && !isFinished && !loading && (
        <Card style={{ marginTop: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', marginBottom: '1rem' }}>
            <span>Question {currentIdx + 1} of {questions.length}</span>
            <span>Score: {score}</span>
          </div>
          
          <h2 style={{ marginBottom: '2rem' }}>{questions[currentIdx].question}</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {questions[currentIdx].options.map((opt, i) => (
              <button 
                key={i}
                onClick={() => handleAnswer(opt)}
                style={{
                  padding: '1rem', background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px',
                  color: 'white', cursor: 'pointer', textAlign: 'left', fontSize: '1rem',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
              >
                {opt}
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* 4. Results Phase */}
      {isFinished && (
        <Card style={{ marginTop: '3rem', textAlign: 'center' }}>
          <h2>Quiz Complete! 🎉</h2>
          <h1 style={{ fontSize: '4rem', margin: '1rem 0', color: 'cyan' }}>
            {score} / {questions.length}
          </h1>
          <Button onClick={() => setQuestions(null)}>
            Try Another Topic
          </Button>
        </Card>
      )}
    </div>
  );
}
