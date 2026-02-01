// Home.jsx — Landing page demonstrating useState and React Router Link
import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './Home.css';

function Home() {
  // State to track if the greeting is shown
  const [showGreeting, setShowGreeting] = useState(false);

  // useEffect to set document title on mount
  useEffect(() => {
    document.title = "Home | StudyPortal";
  }, []);

  // Function to toggle the greeting
  const toggleGreeting = () => {
    setShowGreeting(!showGreeting);
  };

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="hero-title">Welcome to StudyPortal</h1>
        <p className="hero-description">
          The easiest way to generate smart quizzes from your study notes. 
          Powered by Google Gemini and built with React!
        </p>
        
        <NavLink to="/quiz" className="get-started-btn">
          Go to Quiz
        </NavLink>
      </div>

      <div className="state-demo-section">
        <h2>React State Demo</h2>
        <p>Click the button below to see React state in action!</p>
        
        <button onClick={toggleGreeting} className="demo-btn">
          {showGreeting ? 'Hide Welcome' : 'Show Welcome'}
        </button>

        {/* Conditional rendering based on state */}
        {showGreeting && (
          <div className="greeting-card">
            <h3>Hello, future developer! 👋</h3>
            <p>You just toggled a component state using the useState hook.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
