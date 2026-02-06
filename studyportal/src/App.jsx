import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Concepts from './pages/Concepts';
import Quiz from './pages/Quiz';

function App() {
  return (
    <Router>
      <div className="app">
        {/* ✅ TASK: Add the Navbar component here after installing the library! */}
        <nav style={{ padding: '1rem', background: '#1e293b', display: 'flex', gap: '1rem' }}>
          <NavLink to="/" style={({ isActive }) => ({ color: isActive ? 'cyan' : 'white', textDecoration: 'none' })}>Home</NavLink>
          <NavLink to="/about" style={({ isActive }) => ({ color: isActive ? 'cyan' : 'white', textDecoration: 'none' })}>About</NavLink>
          <NavLink to="/concepts" style={({ isActive }) => ({ color: isActive ? 'cyan' : 'white', textDecoration: 'none' })}>Concepts</NavLink>
          <NavLink to="/quiz" style={({ isActive }) => ({ color: isActive ? 'cyan' : 'white', textDecoration: 'none' })}>Quiz</NavLink>
        </nav>

        <main style={{ minHeight: 'calc(100vh - 70px)' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/concepts" element={<Concepts />} />
            <Route path="/quiz" element={<Quiz />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
