// Concepts.jsx — A sandbox page showing live examples of React concepts
import { useState, useEffect } from 'react';
import './Concepts.css';

function Concepts() {
  // useEffect to set document title
  useEffect(() => {
    document.title = "Concepts | StudyPortal";
  }, []);

  // 1. State for Counter Example
  const [count, setCount] = useState(0);

  // 2. State for Text Input Example
  const [text, setText] = useState('');

  // 3. State for Toggle Example
  const [isOn, setIsOn] = useState(false);

  // 4. State for Color Picker Example
  const [color, setColor] = useState('#1A73E8');

  return (
    <div className="concepts-container">
      <h1 className="concepts-title">React Concepts Sandbox</h1>
      <p className="concepts-subtitle">
        Interactive examples of everything we've learned so far!
      </p>

      <div className="sandbox-grid">
        
        {/* Example 1: Counter */}
        <div className="sandbox-card">
          <h2>1. The Classic Counter</h2>
          <p>Using <code>useState</code> to track numbers.</p>
          <div className="demo-area">
            <h3 style={{ fontSize: '2rem', margin: '1rem 0' }}>{count}</h3>
            <div className="button-group">
              <button onClick={() => setCount(count - 1)}>-</button>
              <button onClick={() => setCount(0)}>Reset</button>
              <button onClick={() => setCount(count + 1)}>+</button>
            </div>
          </div>
        </div>

        {/* Example 2: Live Text Input */}
        <div className="sandbox-card">
          <h2>2. Live Text Input</h2>
          <p>Listening to <code>onChange</code> events to update state.</p>
          <div className="demo-area">
            <input 
              type="text" 
              value={text} 
              onChange={(e) => setText(e.target.value)} 
              placeholder="Type something here..."
              className="demo-input"
            />
            <p className="mirror-text">
              You typed: <strong>{text || "(nothing yet)"}</strong>
            </p>
          </div>
        </div>

        {/* Example 3: Conditional Rendering */}
        <div className="sandbox-card">
          <h2>3. The Light Switch</h2>
          <p>Changing UI based on boolean (true/false) state.</p>
          <div className="demo-area" style={{ background: isOn ? '#fff9c4' : '#f1f3f4', borderRadius: '8px', padding: '1rem' }}>
            <h3 style={{ margin: '0 0 1rem 0', color: isOn ? '#f57f17' : '#5f6368' }}>
              {isOn ? '💡 It is ON' : '🌑 It is OFF'}
            </h3>
            <button 
              onClick={() => setIsOn(!isOn)}
              style={{ background: isOn ? '#d32f2f' : '#388e3c' }}
            >
              Turn {isOn ? 'Off' : 'On'}
            </button>
          </div>
        </div>

        {/* Example 4: Dynamic Styling */}
        <div className="sandbox-card">
          <h2>4. Dynamic Styling</h2>
          <p>Updating inline CSS styles with state.</p>
          <div className="demo-area">
            <div 
              className="color-box" 
              style={{ backgroundColor: color }}
            >
              {color}
            </div>
            <div className="color-buttons">
              <button onClick={() => setColor('#1A73E8')} style={{ background: '#1A73E8' }}>Blue</button>
              <button onClick={() => setColor('#34A853')} style={{ background: '#34A853' }}>Green</button>
              <button onClick={() => setColor('#EA4335')} style={{ background: '#EA4335' }}>Red</button>
              <button onClick={() => setColor('#FBBC04')} style={{ background: '#FBBC04', color: 'black' }}>Yellow</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Concepts;
