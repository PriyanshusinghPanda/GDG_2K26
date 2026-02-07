# Day 3 Workshop: The AI Upgrade (Gemini Integration) 🧠

If you fall behind during the live session, don't worry! You can copy and paste the exact code below to catch up.

---

### Step 1: Install the Google AI SDK
Stop your development server and run this command:
```bash
npm install @google/genai
```

---

### Step 2: Create the AI Logic (The "Brain")
Create a new file at **`src/lib/gemini.js`** and paste this code:

```javascript
import { GoogleGenAI } from '@google/genai';

// Initialize the Gemini SDK
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "PASTE_YOUR_API_KEY_HERE";
const ai = new GoogleGenAI({ apiKey: apiKey });

export async function generateQuizQuestions(topic) {
  const prompt = `Create a 3-question multiple choice quiz about: ${topic}.
Return ONLY a valid JSON array of objects. Do NOT wrap it in markdown block quotes (\`\`\`json).
Each object MUST have this exact structure:
{
  "question": "The question text",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "answer": "Option A"
}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    // Clean up any markdown formatting
    let cleanText = response.text.replace(/```json/gi, "").replace(/```/gi, "").trim();
    
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new Error("Failed to generate quiz. Please check your API key.");
  }
}
```

---

### Step 3: Upgrade the Quiz UI (The "Face")
Replace ALL the code in **`src/pages/Quiz.jsx`** with this exact code:

```javascript
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

  // 1. Connection to Gemini
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
      setQuestions(data); // Save the AI result to our state
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 2. Gameplay Logic
  const handleAnswer = (selectedOption) => {
    const currentQ = questions[currentIdx];
    if (selectedOption === currentQ.answer) {
      setScore(score + 1);
    }
    
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(currentIdx + 1); // Go to next question
    } else {
      setIsFinished(true); // End of quiz
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center' }}>AI Quiz Portal</h1>
      <p style={{ textAlign: 'center', color: '#94a3b8' }}>Generate a quiz on any topic in seconds.</p>

      {/* PHASE 1: Topic Selection */}
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

      {/* PHASE 2: Loading Animation */}
      {loading && (
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <h2 style={{ color: 'cyan' }}>✨ Gemini is thinking...</h2>
          <p style={{ color: '#94a3b8' }}>Crafting questions about "{topic}"</p>
        </div>
      )}

      {/* PHASE 3: Gameplay */}
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

      {/* PHASE 4: Results */}
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
```
