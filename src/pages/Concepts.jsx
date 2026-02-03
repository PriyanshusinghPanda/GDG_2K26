// Concepts.jsx — A sandbox page showing live examples of React concepts

// STEP 1: Import React hooks (useState, useEffect) so we can use them
import { useState, useEffect } from 'react';
import './Concepts.css';

// STEP 2: Define the Component function
function Concepts() {
  
  // STEP 3: Hooks (useState and useEffect)
  // These must always be at the top of your function!

  // useEffect runs code when the component first "mounts" (appears on screen)
  useEffect(() => {
    document.title = "Concepts | StudyPortal";
  }, []);

  // UseState Example 1: Numbers (Counter)
  const [count, setCount] = useState(0);

  // UseState Example 2: Strings (Live Text)
  const [text, setText] = useState('');

  // UseState Example 3: Booleans (Toggle/Switch)
  const [isOn, setIsOn] = useState(false);

  // UseState Example 4: Complex Strings (Color CSS)
  const [color, setColor] = useState('#1A73E8');

  // UseState Example 5: Arrays (Simple Todo List)
  const [items, setItems] = useState(['Learn HTML', 'Learn CSS', 'Learn JS']);
  const [newItem, setNewItem] = useState('');

  // UseState Example 6: Form Input handling
  const [userName, setUserName] = useState('');
  const [displayName, setDisplayName] = useState('');

  // STEP 4: Helper Functions (Logic)
  
  const addItem = () => {
    if (newItem.trim() !== '') {
      // Adding to an array state: we must create a NEW array using [...spread]
      setItems([...items, newItem]);
      setNewItem(''); // Clear the input
    }
  };

  const handleJoin = () => {
    setDisplayName(userName);
  };

  // STEP 5: The "Return" (The JSX/HTML that the user sees)
  return (
    <div className="concepts-container">
      <h1 className="concepts-title">React Concepts Sandbox</h1>
      <p className="concepts-subtitle">
        Interactive examples of everything we've learned so far! 
        Look at the code to see how it works step-by-step.
      </p>

      <div className="sandbox-grid">
        
        {/* CONCEPT 1: STATE WITH NUMBERS */}
        <div className="sandbox-card">
          <h2>1. The Classic Counter</h2>
          <p>Using useState to track numbers.</p>
          <div className="demo-area">
            <h3 style={{ fontSize: '2rem', margin: '1rem 0' }}>{count}</h3>
            <div className="button-group">
              <button onClick={() => setCount(count - 1)}>-</button>
              <button onClick={() => setCount(0)}>Reset</button>
              <button onClick={() => setCount(count + 1)}>+</button>
            </div>
          </div>
        </div>

        {/* CONCEPT 2: STATE WITH STRINGS & EVENTS */}
        <div className="sandbox-card">
          <h2>2. Live Text Input</h2>
          <p>Listening to onChange events to update state instantly.</p>
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

        {/* CONCEPT 3: CONDITIONAL RENDERING */}
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

        {/* CONCEPT 4: DYNAMIC STYLING */}
        <div className="sandbox-card">
          <h2>4. Dynamic Styling</h2>
          <p>Updating inline CSS styles by passing a state variable to backgroundColor.</p>
          <div className="demo-area">
            <div className="color-box" style={{ backgroundColor: color }}>
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

        {/* CONCEPT 5: ARRAYS & .MAP() */}
        <div className="sandbox-card">
          <h2>5. Learning List (Arrays)</h2>
          <p>Using .map() to turn an array of strings into a list of HTML elements.</p>
          <div className="demo-area">
            <div className="input-group">
              <input 
                type="text" 
                value={newItem} 
                onChange={(e) => setNewItem(e.target.value)}
                placeholder="Add new skill..."
                className="demo-input-small"
              />
              <button onClick={addItem} className="add-btn">Add</button>
            </div>
            <ul className="sandbox-list">
              {items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* CONCEPT 6: FORM LOGIC */}
        <div className="sandbox-card">
          <h2>6. Join the Bootcamp</h2>
          <p>Only update the displayName when the user clicks the button!</p>
          <div className="demo-area">
            <input 
              type="text" 
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Your name..."
              className="demo-input"
            />
            <button onClick={handleJoin} style={{ width: '100%' }}>Register Me!</button>
            {displayName && (
              <div className="welcome-banner">
                🚀 Welcome to Day 2, {displayName}!
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

// STEP 6: Export the component to use it in App.jsx
export default Concepts;
